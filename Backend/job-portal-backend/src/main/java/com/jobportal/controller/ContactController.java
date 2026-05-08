package com.jobportal.controller;

import com.jobportal.entity.ContactMessage;
import com.jobportal.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    // POST /api/contact  — anyone can send a message
    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody ContactMessage message) {
        contactMessageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully!"));
    }

    // GET /api/contact  — only admin can read messages
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }

    // PUT /api/contact/{id}/read  — mark as read
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        contactMessageRepository.findById(id).ifPresent(msg -> {
            msg.setRead(true);
            contactMessageRepository.save(msg);
        });
        return ResponseEntity.ok().build();
    }
}