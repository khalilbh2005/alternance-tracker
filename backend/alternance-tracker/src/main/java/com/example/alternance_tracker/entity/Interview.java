package com.example.alternance_tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Interview date is required")
    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @NotNull(message = "Interview type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private InterviewType type;

    @Size(max = 2000, message = "Notes must be <= 2000 characters")
    @Column(length = 2000)
    private String notes;

    @Size(max = 40, message = "Result must be <= 40 characters")
    @Column(length = 40)
    private String result; // "OK", "KO", "NEXT_STEP", etc.

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Application application;

    public Interview() {}

    public Long getId() { return id; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public InterviewType getType() { return type; }
    public void setType(InterviewType type) { this.type = type; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
}
