package com.example.alternance_tracker.service;

import com.example.alternance_tracker.entity.Company;
import com.example.alternance_tracker.entity.Offer;
import com.example.alternance_tracker.repository.CompanyRepository;
import com.example.alternance_tracker.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferService {

    private final OfferRepository offerRepository;
    private final CompanyRepository companyRepository;

    public OfferService(OfferRepository offerRepository, CompanyRepository companyRepository) {
        this.offerRepository = offerRepository;
        this.companyRepository = companyRepository;
    }

    public List<Offer> findAll(Long companyId) {
        if (companyId != null) {
            return offerRepository.findByCompanyId(companyId);
        }
        return offerRepository.findAll();
    }

    public Offer findById(Long id) {
        return offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id=" + id));
    }

    public Offer create(Long companyId, Offer offer) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id=" + companyId));

        offer.setCompany(company);
        return offerRepository.save(offer);
    }

    public Offer update(Long id, Offer updated) {
        Offer existing = findById(id);

        existing.setTitle(updated.getTitle());
        existing.setLocation(updated.getLocation());
        existing.setTechStack(updated.getTechStack());
        existing.setUrl(updated.getUrl());
        existing.setDescription(updated.getDescription());

        // On ne change pas l'entreprise ici (simple)
        return offerRepository.save(existing);
    }

    public void delete(Long id) {
        Offer existing = findById(id);
        offerRepository.delete(existing);
    }
}
