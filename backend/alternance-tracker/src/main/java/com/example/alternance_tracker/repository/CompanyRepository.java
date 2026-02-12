package com.example.alternance_tracker.repository;
import com.example.alternance_tracker.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CompanyRepository extends JpaRepository<Company, Long> {
}