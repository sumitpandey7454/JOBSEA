package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phoneNumber;

    private String name;

    private String profilePicture;

    // "GOOGLE" or "PHONE" or "EMAIL"
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    // "USER" or "ADMIN"
    @Enumerated(EnumType.STRING)
    
    private Role role = Role.USER;

    @Builder.Default
    private boolean enabled = true;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AuthProvider {
        GOOGLE, PHONE, EMAIL
    }

    public enum Role {
        USER, ADMIN
    }
}