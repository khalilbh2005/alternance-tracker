package com.example.alternance_tracker.service;

import com.example.alternance_tracker.dto.DashboardResponse;
import com.example.alternance_tracker.dto.FollowUpItem;
import com.example.alternance_tracker.dto.RecentApplicationItem;
import com.example.alternance_tracker.entity.Application;
import com.example.alternance_tracker.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;

    public DashboardService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public DashboardResponse getDashboard() {
        LocalDate today = LocalDate.now();

        // 1) Stats par statut
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (Object[] row : applicationRepository.countByStatus()) {
            Object status = row[0];
            Object count = row[1];
            byStatus.put(String.valueOf(status), ((Number) count).longValue());
        }

        // 2) Count "à relancer"
        long toFollowUpCount = applicationRepository.countByFollowUpAtLessThanEqual(today);

        // 3) Liste "à relancer" (top 10)
        List<FollowUpItem> toFollowUp = applicationRepository.findFollowUpRows(today).stream()
                .limit(10)
                .map(r -> new FollowUpItem(
                        r.getId(),
                        r.getStatus().name(),
                        r.getFollowUpAt(),
                        r.getChannel(),
                        r.getNotes(),
                        r.getOfferTitle(),
                        r.getCompanyName()
                ))
                .toList();

        // 4) Dernières candidatures (top 5) -> DTO (évite de renvoyer les entités brutes)
        List<RecentApplicationItem> recent = applicationRepository.findTop5ByOrderByIdDesc().stream()
                .map(a -> toRecentItem(a))
                .toList();

        return new DashboardResponse(byStatus, toFollowUpCount, toFollowUp, recent);
    }

    private RecentApplicationItem toRecentItem(Application a) {
        // Ici on accède à offer/company : ça marche car on sérialise un DTO (et Spring a encore le contexte)
        String offerTitle = a.getOffer() != null ? a.getOffer().getTitle() : null;
        String companyName = (a.getOffer() != null && a.getOffer().getCompany() != null) ? a.getOffer().getCompany().getName() : null;

        return new RecentApplicationItem(
                a.getId(),
                a.getStatus() != null ? a.getStatus().name() : null,
                a.getAppliedAt(),
                offerTitle,
                companyName
        );
    }
}
