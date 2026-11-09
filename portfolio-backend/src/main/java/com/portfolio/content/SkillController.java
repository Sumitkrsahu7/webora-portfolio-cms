package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class SkillController {

    private final SkillRepository repository;

    public SkillController(SkillRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/skills")
    public List<SkillResponse> getPublicSkills() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(SkillResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/skills")
    public List<SkillResponse> getAdminSkills() {
        return repository.findAllByOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(SkillResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse createSkill(
        @Valid @RequestBody SkillRequest request
    ) {
        Skill skill = Skill.create(UUID.randomUUID(), request);
        return SkillResponse.from(repository.save(skill));
    }

    @PutMapping("/api/admin/skills/{id}")
    public SkillResponse updateSkill(
        @PathVariable UUID id,
        @Valid @RequestBody SkillRequest request
    ) {
        Skill skill = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Skill not found"
            ));

        skill.update(request);
        return SkillResponse.from(repository.save(skill));
    }

    @DeleteMapping("/api/admin/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Skill not found"
            );
        }

        repository.deleteById(id);
    }
}