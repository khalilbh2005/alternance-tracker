package com.example.alternance_tracker.dto;

import java.time.LocalDate;

public class FollowUpItem {

    private Long id;
    private String status;
    private LocalDate followUpAt;
    private String channel;
    private String notes;
    private String offerTitle;
    private String companyName;

    public FollowUpItem(Long id, String status, LocalDate followUpAt, String channel, String notes, String offerTitle, String companyName) {
        this.id = id;
        this.status = status;
        this.followUpAt = followUpAt;
        this.channel = channel;
        this.notes = notes;
        this.offerTitle = offerTitle;
        this.companyName = companyName;
    }

    public Long getId() { return id; }
    public String getStatus() { return status; }
    public LocalDate getFollowUpAt() { return followUpAt; }
    public String getChannel() { return channel; }
    public String getNotes() { return notes; }
    public String getOfferTitle() { return offerTitle; }
    public String getCompanyName() { return companyName; }
}
