package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FaqRepository extends JpaRepository<Faq, UUID> {

    List<Faq> findByPublishedTrueOrderByDisplayOrderAscQuestionAsc();

    List<Faq> findAllByOrderByDisplayOrderAscQuestionAsc();
}
