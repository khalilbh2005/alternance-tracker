package com.example.alternance_tracker.repository;

import com.example.alternance_tracker.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByCompanyId(Long companyId);
}