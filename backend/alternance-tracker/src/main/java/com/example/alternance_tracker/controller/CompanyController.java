package com.example.alternance_tracker.controller;

import com.example.alternance_tracker.entity.Company;
import com.example.alternance_tracker.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public List<Company> getAll() {
        return companyService.findAll();
    }

    @GetMapping("/{id}")
    public Company getById(@PathVariable Long id) {
        return companyService.findById(id);
    }

    @PostMapping
    public Company create(@Valid @RequestBody Company company) {
        return companyService.create(company);
    }

    @PutMapping("/{id}")
    public Company update(@PathVariable Long id, @Valid @RequestBody Company company) {
        return companyService.update(id, company);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        companyService.delete(id);
    }
}
