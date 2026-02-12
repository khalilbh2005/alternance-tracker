package com.example.alternance_tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Contact name is required")
    @Size(max = 120, message = "Contact name must be <= 120 characters")
    @Column(nullable = false, length = 120)
    private String name;

    @Email(message = "Email must be valid")
    @Size(max = 160, message = "Email must be <= 160 characters")
    @Column(length = 160)
    private String email;

    @Size(max = 30, message = "Phone must be <= 30 characters")
    @Column(length = 30)
    private String phone;

    @Size(max = 80, message = "Role must be <= 80 characters")
    @Column(length = 80)
    private String role; // RH, Tech lead, Manager...

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    public Contact() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
