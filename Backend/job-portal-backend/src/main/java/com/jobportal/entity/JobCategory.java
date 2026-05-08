package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // e.g. "Education", "IT Jobs", "Sales Jobs", "Govt Jobs"

    private String slug; // e.g. "education", "it-jobs", "sales-jobs", "govt-jobs"

    private String icon; // emoji or icon name: "🎓", "💻", "💼", "🏛️"

    private String description;
}