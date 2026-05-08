package com.jobportal.dto;

import com.jobportal.entity.Job;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobDto {

    @Data
    public static class JobRequest {

        @NotBlank(message = "Job title is required")
        private String title;

        @NotBlank(message = "Organization name is required")
        private String organization;

        private String location;

        private String description;

        @NotBlank(message = "Application link is required")
        private String applicationLink;

        private String qualification;

        private String salary;

        private LocalDate lastDate;

        @NotNull(message = "Category is required")
        private Long categoryId;

        private boolean featured = false;

        private Job.JobStatus status = Job.JobStatus.ACTIVE;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobResponse {
        private Long id;
        private String title;
        private String organization;
        private String location;
        private String description;
        private String applicationLink;
        private String qualification;
        private String salary;
        private LocalDate lastDate;
        private CategoryResponse category;
        private Job.JobStatus status;
        private boolean featured;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String slug;
        private String icon;
        private String description;
        private long jobCount;
    }
}