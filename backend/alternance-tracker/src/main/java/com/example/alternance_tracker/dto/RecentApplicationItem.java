package com.example.alternance_tracker.dto;

import java.time.LocalDate;

public class RecentApplicationItem {

    private Long id;
    private String status;
    private LocalDate appliedAt;
    private String offerTitle;
    private String companyName;

    public RecentApplicationItem(Long id, String status, LocalDate appliedAt, String offerTitle, String companyName) {
        this.id = id;
        this.status = status;
        this.appliedAt = appliedAt;
        this.offerTitle = offerTitle;
        this.companyName = companyName;
    }

    public Long getId() { return id; }
    public String getStatus() { return status; }
    public LocalDate getAppliedAt() { return appliedAt; }
    public String getOfferTitle() { return offerTitle; }
    public String getCompanyName() { return companyName; }
}
