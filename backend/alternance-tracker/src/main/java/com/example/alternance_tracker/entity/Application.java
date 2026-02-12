package com.example.alternance_tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.SPOTTED;

    private LocalDate spottedAt;
    private LocalDate appliedAt;
    private LocalDate followUpAt;

    @Size(max = 40, message = "Channel must be <= 40 characters")
    @Column(length = 40)
    private String channel; // LinkedIn, email, site...

    @Size(max = 2000, message = "Notes must be <= 2000 characters")
    @Column(length = 2000)
    private String notes;
    @OneToMany(mappedBy = "application", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Interview> interviews = new ArrayList<>();


    // Plusieurs candidatures pour 1 offre
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Offer offer;

    public Application() {}

    public Long getId() { return id; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public LocalDate getSpottedAt() { return spottedAt; }
    public void setSpottedAt(LocalDate spottedAt) { this.spottedAt = spottedAt; }

    public LocalDate getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDate appliedAt) { this.appliedAt = appliedAt; }

    public LocalDate getFollowUpAt() { return followUpAt; }
    public void setFollowUpAt(LocalDate followUpAt) { this.followUpAt = followUpAt; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Offer getOffer() { return offer; }
    public void setOffer(Offer offer) { this.offer = offer; }
}
