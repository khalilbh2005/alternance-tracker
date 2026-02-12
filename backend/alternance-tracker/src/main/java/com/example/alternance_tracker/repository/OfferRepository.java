package com.example.alternance_tracker.repository;

import com.example.alternance_tracker.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByCompanyId(Long companyId);
    boolean existsByCompanyId(Long companyId);
}
