package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceRepository extends JpaRepository<ServiceItem, UUID> {
    List<ServiceItem> findByPublishedTrueOrderByDisplayOrderAscTitleAsc();
    List<ServiceItem> findAllByOrderByDisplayOrderAscTitleAsc();
    Optional<ServiceItem> findBySlugIgnoreCaseAndPublishedTrue(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);
}
