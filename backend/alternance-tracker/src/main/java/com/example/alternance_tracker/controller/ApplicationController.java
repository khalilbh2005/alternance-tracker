package com.example.alternance_tracker.controller;

import com.example.alternance_tracker.entity.Application;
import com.example.alternance_tracker.entity.ApplicationStatus;
import com.example.alternance_tracker.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Ex: /api/applications?status=APPLIED
    @GetMapping
    public List<Application> getAll(@RequestParam(required = false) ApplicationStatus status) {
        return applicationService.findAll(status);
    }

    // Liste à relancer
    @GetMapping("/to-follow-up")
    public List<Application> toFollowUp() {
        return applicationService.toFollowUp();
    }

    @GetMapping("/{id}")
    public Application getById(@PathVariable Long id) {
        return applicationService.findById(id);
    }

    // Créer une candidature pour une offre:
    // POST /api/applications?offerId=1
    @PostMapping
    public Application create(@RequestParam Long offerId, @Valid @RequestBody Application application) {
        return applicationService.create(offerId, application);
    }

    @PutMapping("/{id}")
    public Application update(@PathVariable Long id, @Valid @RequestBody Application application) {
        return applicationService.update(id, application);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        applicationService.delete(id);
    }
}
