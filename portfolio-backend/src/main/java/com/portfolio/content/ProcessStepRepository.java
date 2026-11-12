package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProcessStepRepository extends JpaRepository<ProcessStep, UUID> {
    List<ProcessStep> findByPublishedTrueOrderByStepNumberAsc();
    List<ProcessStep> findAllByOrderByStepNumberAsc();
}
