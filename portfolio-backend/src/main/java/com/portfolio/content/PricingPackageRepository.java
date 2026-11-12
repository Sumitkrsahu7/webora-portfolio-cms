package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PricingPackageRepository extends JpaRepository<PricingPackage, UUID> {
    List<PricingPackage> findByPublishedTrueOrderByDisplayOrderAscNameAsc();
    List<PricingPackage> findAllByOrderByDisplayOrderAscNameAsc();
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);
}
