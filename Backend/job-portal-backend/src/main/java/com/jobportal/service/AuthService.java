package com.jobportal.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.jobportal.dto.AuthDto.*;
import com.jobportal.entity.OtpStore;
import com.jobportal.entity.User;
import com.jobportal.repository.OtpStoreRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtUtil;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OtpStoreRepository otpStoreRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Value("${twilio.account-sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token}")
    private String twilioAuthToken;

    @Value("${twilio.from-number}")
    private String twilioFromNumber;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(twilioAccountSid, twilioAuthToken);
    }

    // ---- GOOGLE AUTH ----

    public AuthResponse loginWithGoogle(GoogleAuthRequest request) throws Exception {
        try {
        	GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
        	        new NetHttpTransport(), GsonFactory.getDefaultInstance())
        	        .setAudience(Collections.singletonList(googleClientId))
        	        .setAcceptableTimeSkewSeconds(300)
        	        .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                log.error("Invalid Google ID token received");
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            log.info("Google login attempt for email: {}", email);

            boolean isNewUser = !userRepository.existsByEmail(email);

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setProfilePicture(picture);
                newUser.setAuthProvider(User.AuthProvider.GOOGLE);
                newUser.setRole(User.Role.USER);
                newUser.setEnabled(true);
                newUser.setCreatedAt(LocalDateTime.now());
                return newUser;
        });

            user.setName(name);
            user.setProfilePicture(picture);
            user = userRepository.save(user);

            String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

            log.info("Google login successful for: {}", email);

            return AuthResponse.builder()
                    .token(token)
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .isNewUser(isNewUser)
                    .build();

        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            throw e;
        }
    }
    // ---- PHONE OTP AUTH ----

    public MessageResponse sendOtp(PhoneSendOtpRequest request) {
        String phone = request.getPhoneNumber();

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save OTP (expires in 5 minutes)
        OtpStore otpStore = OtpStore.builder()
                .phoneNumber(phone)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();
        otpStoreRepository.save(otpStore);

        // Send via Twilio
        try {
            Message.creator(
                    new PhoneNumber(phone),
                    new PhoneNumber(twilioFromNumber),
                    "Your JobPortal OTP is: " + otp + ". Valid for 5 minutes."
            ).create();
            log.info("OTP sent to {}", phone);
        } catch (Exception e) {
            log.error("Failed to send OTP to {}: {}", phone, e.getMessage());
            // In dev, log the OTP instead
            log.debug("DEV OTP for {}: {}", phone, otp);
        }

        return MessageResponse.builder()
                .message("OTP sent successfully")
                .success(true)
                .build();
    }

    public AuthResponse verifyOtp(PhoneVerifyOtpRequest request) {
        String phone = request.getPhoneNumber();

        OtpStore otpStore = otpStoreRepository
                .findTopByPhoneNumberAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        phone, LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("OTP expired or not found"));

        if (!otpStore.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        otpStore.setUsed(true);
        otpStoreRepository.save(otpStore);

        boolean isNewUser = !userRepository.existsByPhoneNumber(phone);

        User user = userRepository.findByPhoneNumber(phone).orElseGet(() ->
                User.builder()
                        .phoneNumber(phone)
                        .name("User " + phone.substring(phone.length() - 4))
                        .authProvider(User.AuthProvider.PHONE)
                        .build()
        );

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .isNewUser(isNewUser)
                .build();
    }
}