package com.example.alternance_tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Offer title is required")
    @Size(max = 160, message = "Title must be <= 160 characters")
    @Column(nullable = false, length = 160)
    private String title;

    @Size(max = 120, message = "Location must be <= 120 characters")
    @Column(length = 120)
    private String location;

    @Size(max = 200, message = "Tech stack must be <= 200 characters")
    @Column(length = 200)
    private String techStack;

    @Size(max = 300, message = "URL must be <= 300 characters")
    @Column(length = 300)
    private String url;

    @Size(max = 4000, message = "Description must be <= 4000 characters")
    @Column(length = 4000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @OneToMany(mappedBy = "offer", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications = new ArrayList<>();

    // Relation: plusieurs offres pour 1 entreprise
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    public Offer() {}

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
