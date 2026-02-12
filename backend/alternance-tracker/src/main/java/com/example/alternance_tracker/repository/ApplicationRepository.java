package com.example.alternance_tracker.repository;

import com.example.alternance_tracker.entity.Application;
import com.example.alternance_tracker.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByFollowUpAtLessThanEqual(LocalDate date);

    long countByFollowUpAtLessThanEqual(LocalDate date);

    // stats par status: retourne [status, count]
    @Query("select a.status, count(a) from Application a group by a.status")
    List<Object[]> countByStatus();

    // Liste à relancer avec infos offre + entreprise (évite les soucis LAZY)
    interface FollowUpRow {
        Long getId();
        ApplicationStatus getStatus();
        LocalDate getFollowUpAt();
        String getChannel();
        String getNotes();
        String getOfferTitle();
        String getCompanyName();
    }

    @Query("""
        select 
          a.id as id,
          a.status as status,
          a.followUpAt as followUpAt,
          a.channel as channel,
          a.notes as notes,
          o.title as offerTitle,
          c.name as companyName
        from Application a
        join a.offer o
        join o.company c
        where a.followUpAt is not null and a.followUpAt <= :today
        order by a.followUpAt asc, a.id asc
    """)
    List<FollowUpRow> findFollowUpRows(LocalDate today);

    // Dernières candidatures (simple)
    List<Application> findTop5ByOrderByIdDesc();
}
