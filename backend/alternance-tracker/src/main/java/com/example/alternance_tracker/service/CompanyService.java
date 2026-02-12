package com.example.alternance_tracker.service;

import com.example.alternance_tracker.entity.Company;
import com.example.alternance_tracker.exception.BadRequestException;
import com.example.alternance_tracker.exception.ResourceNotFoundException;
import com.example.alternance_tracker.repository.CompanyRepository;
import com.example.alternance_tracker.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final OfferRepository offerRepository;

    public CompanyService(CompanyRepository companyRepository, OfferRepository offerRepository) {
        this.companyRepository = companyRepository;
        this.offerRepository = offerRepository;
    }

    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    public Company findById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id=" + id));
    }

    public Company create(Company company) {
        return companyRepository.save(company);
    }

    public Company update(Long id, Company updated) {
        Company existing = findById(id);

        existing.setName(updated.getName());
        existing.setSector(updated.getSector());
        existing.setWebsite(updated.getWebsite());
        existing.setLocation(updated.getLocation());
        existing.setNotes(updated.getNotes());

        return companyRepository.save(existing);
    }

    public void delete(Long id) {
        Company existing = findById(id);

        // ✅ règle métier : on empêche la suppression si l’entreprise a des offres
        if (offerRepository.existsByCompanyId(id)) {
            throw new BadRequestException("Impossible de supprimer cette entreprise : elle possède des offres. Supprime d’abord les offres liées.");
        }

        companyRepository.delete(existing);
    }
}
