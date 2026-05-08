package com.jobportal.controller;

import com.jobportal.dto.AuthDto.*;
import com.jobportal.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/google
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) throws Exception {
        return ResponseEntity.ok(authService.loginWithGoogle(request));
    }

    // POST /api/auth/phone/send-otp
    @PostMapping("/phone/send-otp")
    public ResponseEntity<MessageResponse> sendOtp(@RequestBody PhoneSendOtpRequest request) {
        return ResponseEntity.ok(authService.sendOtp(request));
    }

    // POST /api/auth/phone/verify-otp
    @PostMapping("/phone/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody PhoneVerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }
}