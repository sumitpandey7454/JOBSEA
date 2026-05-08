package com.jobportal.controller;

import com.jobportal.dto.JobDto.*;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // GET /api/jobs?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getAllJobs(page, size));
    }

    // GET /api/jobs/category/{categoryId}?page=0&size=10
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<JobResponse>> getJobsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getJobsByCategory(categoryId, page, size));
    }

    // GET /api/jobs/search?keyword=software&page=0&size=10
    @GetMapping("/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, page, size));
    }

    // GET /api/jobs/featured
    @GetMapping("/featured")
    public ResponseEntity<List<JobResponse>> getFeaturedJobs() {
        return ResponseEntity.ok(jobService.getFeaturedJobs());
    }

    // GET /api/jobs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // POST /api/jobs  (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    // PUT /api/jobs/{id}  (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id,
                                                  @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    // DELETE /api/jobs/{id}  (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}