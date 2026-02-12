package com.example.alternance_tracker.service;

import com.example.alternance_tracker.entity.Application;
import com.example.alternance_tracker.entity.ApplicationStatus;
import com.example.alternance_tracker.entity.Offer;
import com.example.alternance_tracker.repository.ApplicationRepository;
import com.example.alternance_tracker.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OfferRepository offerRepository;

    public ApplicationService(ApplicationRepository applicationRepository, OfferRepository offerRepository) {
        this.applicationRepository = applicationRepository;
        this.offerRepository = offerRepository;
    }

    public List<Application> findAll(ApplicationStatus status) {
        if (status != null) return applicationRepository.findByStatus(status);
        return applicationRepository.findAll();
    }

    public List<Application> toFollowUp() {
        return applicationRepository.findByFollowUpAtLessThanEqual(LocalDate.now());
    }

    public Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id=" + id));
    }

    public Application create(Long offerId, Application application) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found with id=" + offerId));

        application.setOffer(offer);

        // petites valeurs par défaut utiles
        if (application.getSpottedAt() == null) {
            application.setSpottedAt(LocalDate.now());
        }

        return applicationRepository.save(application);
    }

    public Application update(Long id, Application updated) {
        Application existing = findById(id);

        existing.setStatus(updated.getStatus());
        existing.setSpottedAt(updated.getSpottedAt());
        existing.setAppliedAt(updated.getAppliedAt());
        existing.setFollowUpAt(updated.getFollowUpAt());
        existing.setChannel(updated.getChannel());
        existing.setNotes(updated.getNotes());

        return applicationRepository.save(existing);
    }

    public void delete(Long id) {
        Application existing = findById(id);
        applicationRepository.delete(existing);
    }
}
