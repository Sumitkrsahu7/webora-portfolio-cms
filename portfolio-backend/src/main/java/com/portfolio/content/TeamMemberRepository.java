package com.portfolio.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    List<TeamMember> findByPublishedTrueOrderByDisplayOrderAscNameAsc();
    List<TeamMember> findAllByOrderByDisplayOrderAscNameAsc();
}
