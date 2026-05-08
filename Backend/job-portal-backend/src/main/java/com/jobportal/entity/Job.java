package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String organization; // Company or department name

    private String location; // e.g. "Delhi", "Remote", "All India"

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String applicationLink; // The external apply link (most important field!)

    private String qualification; // e.g. "Graduation", "B.Tech", "12th Pass"

    private String salary; // e.g. "₹30,000 - ₹50,000", "As per norms"

    private LocalDate lastDate; // Application deadline

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    @Builder.Default
    private boolean featured = false;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum JobStatus {
        ACTIVE, CLOSED, DRAFT
    }
}