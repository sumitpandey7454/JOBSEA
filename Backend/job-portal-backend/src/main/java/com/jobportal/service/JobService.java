package com.jobportal.service;

import com.jobportal.dto.JobDto.*;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobCategory;
import com.jobportal.repository.JobCategoryRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobCategoryRepository categoryRepository;

    public Page<JobResponse> getAllJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.findByStatus(Job.JobStatus.ACTIVE, pageable)
                .map(this::toResponse);
    }

    public Page<JobResponse> getJobsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.findByCategoryIdAndStatus(categoryId, Job.JobStatus.ACTIVE, pageable)
                .map(this::toResponse);
    }

    public Page<JobResponse> searchJobs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.searchJobs(keyword, pageable).map(this::toResponse);
    }

    public List<JobResponse> getFeaturedJobs() {
        return jobRepository.findByFeaturedTrueAndStatus(Job.JobStatus.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return toResponse(job);
    }

    public JobResponse createJob(JobRequest request) {
        JobCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Job job = Job.builder()
                .title(request.getTitle())
                .organization(request.getOrganization())
                .location(request.getLocation())
                .description(request.getDescription())
                .applicationLink(request.getApplicationLink())
                .qualification(request.getQualification())
                .salary(request.getSalary())
                .lastDate(request.getLastDate())
                .category(category)
                .featured(request.isFeatured())
                .status(request.getStatus())
                .build();

        return toResponse(jobRepository.save(job));
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        JobCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        job.setTitle(request.getTitle());
        job.setOrganization(request.getOrganization());
        job.setLocation(request.getLocation());
        job.setDescription(request.getDescription());
        job.setApplicationLink(request.getApplicationLink());
        job.setQualification(request.getQualification());
        job.setSalary(request.getSalary());
        job.setLastDate(request.getLastDate());
        job.setCategory(category);
        job.setFeatured(request.isFeatured());
        job.setStatus(request.getStatus());

        return toResponse(jobRepository.save(job));
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    private JobResponse toResponse(Job job) {
        long jobCount = jobRepository.countByCategoryIdAndStatus(
                job.getCategory().getId(), Job.JobStatus.ACTIVE);

        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(job.getCategory().getId())
                .name(job.getCategory().getName())
                .slug(job.getCategory().getSlug())
                .icon(job.getCategory().getIcon())
                .description(job.getCategory().getDescription())
                .jobCount(jobCount)
                .build();

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .organization(job.getOrganization())
                .location(job.getLocation())
                .description(job.getDescription())
                .applicationLink(job.getApplicationLink())
                .qualification(job.getQualification())
                .salary(job.getSalary())
                .lastDate(job.getLastDate())
                .category(categoryResponse)
                .status(job.getStatus())
                .featured(job.isFeatured())
                .createdAt(job.getCreatedAt())
                .build();
    }
}