package com.jobportal.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// ---- Auth DTOs ----

public class AuthDto {

    @Data
    public static class GoogleAuthRequest {
        private String idToken; // Google ID token from frontend
    }

    @Data
    public static class PhoneSendOtpRequest {
        private String phoneNumber; // e.g. "+919876543210"
    }

    @Data
    public static class PhoneVerifyOtpRequest {
        private String phoneNumber;
        private String otp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;       // JWT token
        private String name;
        private String email;
        private String phoneNumber;
        private String role;
        private boolean isNewUser;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
        private boolean success;
    }
}