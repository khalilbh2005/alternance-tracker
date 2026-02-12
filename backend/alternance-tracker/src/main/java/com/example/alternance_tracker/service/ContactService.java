package com.example.alternance_tracker.service;

import com.example.alternance_tracker.entity.Company;
import com.example.alternance_tracker.entity.Contact;
import com.example.alternance_tracker.repository.CompanyRepository;
import com.example.alternance_tracker.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;

    public ContactService(ContactRepository contactRepository, CompanyRepository companyRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
    }

    public List<Contact> findAll(Long companyId) {
        if (companyId != null) {
            return contactRepository.findByCompanyId(companyId);
        }
        return contactRepository.findAll();
    }

    public Contact findById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id=" + id));
    }

    public Contact create(Long companyId, Contact contact) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id=" + companyId));

        contact.setCompany(company);
        return contactRepository.save(contact);
    }

    public Contact update(Long id, Contact updated) {
        Contact existing = findById(id);

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setRole(updated.getRole());

        return contactRepository.save(existing);
    }

    public void delete(Long id) {
        Contact existing = findById(id);
        contactRepository.delete(existing);
    }
}
