package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ServicePolicyRepository extends JpaRepository<ServicePolicy, UUID> {
    List<ServicePolicy> findByPublishedTrueOrderByDisplayOrderAscTitleAsc();
    List<ServicePolicy> findAllByOrderByDisplayOrderAscTitleAsc();
}
