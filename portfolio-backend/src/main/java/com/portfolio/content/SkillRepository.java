package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findAllByOrderByDisplayOrderAscNameAsc();

    List<Skill> findByPublishedTrueOrderByDisplayOrderAscNameAsc();
}