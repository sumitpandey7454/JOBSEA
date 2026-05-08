package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByCategoryIdAndStatus(Long categoryId, Job.JobStatus status, Pageable pageable);

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    List<Job> findByFeaturedTrueAndStatus(Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.organization) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchJobs(@Param("keyword") String keyword, Pageable pageable);

    long countByCategoryIdAndStatus(Long categoryId, Job.JobStatus status);
}