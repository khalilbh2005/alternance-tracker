package com.example.alternance_tracker.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 120, message = "Company name must be <= 120 characters")
    @Column(nullable = false, length = 120)
    private String name;

    @Size(max = 80, message = "Sector must be <= 80 characters")
    @Column(length = 80)
    private String sector;

    @Size(max = 200, message = "Website must be <= 200 characters")
    @Column(length = 200)
    private String website;

    @Size(max = 120, message = "Location must be <= 120 characters")
    @Column(length = 120)
    private String location;

    @Size(max = 2000, message = "Notes must be <= 2000 characters")
    @Column(length = 2000)
    private String notes;
    @OneToMany(mappedBy = "company", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Offer> offers = new ArrayList<>();
    @OneToMany(mappedBy = "company", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Contact> contacts = new ArrayList<>();


    public Company() {}

    public Company(String name, String sector, String website, String location, String notes) {
        this.name = name;
        this.sector = sector;
        this.website = website;
        this.location = location;
        this.notes = notes;
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

}