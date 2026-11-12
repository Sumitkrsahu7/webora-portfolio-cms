package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class TeamMemberController {

    private final TeamMemberRepository repository;

    public TeamMemberController(TeamMemberRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/team")
    public List<TeamMemberResponse> getPublicTeam() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(TeamMemberResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/team")
    public List<TeamMemberResponse> getAdminTeam() {
        return repository.findAllByOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(TeamMemberResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/team")
    @ResponseStatus(HttpStatus.CREATED)
    public TeamMemberResponse createTeamMember(
        @Valid @RequestBody TeamMemberRequest request
    ) {
        TeamMember member = TeamMember.create(UUID.randomUUID(), request);
        return TeamMemberResponse.from(repository.save(member));
    }

    @PutMapping("/api/admin/team/{id}")
    public TeamMemberResponse updateTeamMember(
        @PathVariable UUID id,
        @Valid @RequestBody TeamMemberRequest request
    ) {
        TeamMember member = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Team member not found"
            ));

        member.update(request);
        return TeamMemberResponse.from(repository.save(member));
    }

    @DeleteMapping("/api/admin/team/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeamMember(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Team member not found"
            );
        }
        repository.deleteById(id);
    }
}
