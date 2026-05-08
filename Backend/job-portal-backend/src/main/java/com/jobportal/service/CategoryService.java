package com.jobportal.service;

import com.jobportal.dto.JobDto.CategoryResponse;
import com.jobportal.entity.JobCategory;
import com.jobportal.repository.JobCategoryRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.entity.Job;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final JobCategoryRepository categoryRepository;
    private final JobRepository jobRepository;

    // Seed default categories on startup if none exist
    @PostConstruct
    public void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<JobCategory> defaults = List.of(
                JobCategory.builder()
                    .name("Education").slug("education")
                    .icon("🎓").description("Teaching, tutoring and academic roles")
                    .build(),
                JobCategory.builder()
                    .name("IT Jobs").slug("it-jobs")
                    .icon("💻").description("Software, tech and IT roles")
                    .build(),
                JobCategory.builder()
                    .name("Sales Jobs").slug("sales-jobs")
                    .icon("💼").description("Sales, marketing and business roles")
                    .build(),
                JobCategory.builder()
                    .name("Govt Jobs").slug("govt-jobs")
                    .icon("🏛️").description("Government and public sector roles")
                    .build()
            );
            categoryRepository.saveAll(defaults);
            log.info("Default job categories seeded.");
        }
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> {
                    long count = jobRepository.countByCategoryIdAndStatus(
                            cat.getId(), Job.JobStatus.ACTIVE);
                    return CategoryResponse.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .slug(cat.getSlug())
                            .icon(cat.getIcon())
                            .description(cat.getDescription())
                            .jobCount(count)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        JobCategory cat = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found: " + slug));
        long count = jobRepository.countByCategoryIdAndStatus(cat.getId(), Job.JobStatus.ACTIVE);
        return CategoryResponse.builder()
                .id(cat.getId()).name(cat.getName()).slug(cat.getSlug())
                .icon(cat.getIcon()).description(cat.getDescription())
                .jobCount(count).build();
    }

    public CategoryResponse createCategory(JobCategory category) {
        JobCategory saved = categoryRepository.save(category);
        return CategoryResponse.builder()
                .id(saved.getId()).name(saved.getName()).slug(saved.getSlug())
                .icon(saved.getIcon()).description(saved.getDescription())
                .jobCount(0).build();
    }
}