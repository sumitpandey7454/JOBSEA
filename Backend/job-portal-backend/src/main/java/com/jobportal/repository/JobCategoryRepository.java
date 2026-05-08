package com.jobportal.repository;

import com.jobportal.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    Optional<JobCategory> findBySlug(String slug);
}