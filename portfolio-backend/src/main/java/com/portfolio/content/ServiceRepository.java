package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ServiceRepository
    extends JpaRepository<ServiceItem, UUID> {

    List<ServiceItem> findAllByOrderByDisplayOrderAscTitleAsc();

    List<ServiceItem> findByPublishedTrueOrderByDisplayOrderAscTitleAsc();
}