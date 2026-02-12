package com.example.alternance_tracker.dto;

import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private Map<String, Long> applicationsByStatus;
    private long toFollowUpCount;
    private List<FollowUpItem> toFollowUp; // top 10
    private List<RecentApplicationItem> recentApplications; // top 5

    public DashboardResponse(
            Map<String, Long> applicationsByStatus,
            long toFollowUpCount,
            List<FollowUpItem> toFollowUp,
            List<RecentApplicationItem> recentApplications
    ) {
        this.applicationsByStatus = applicationsByStatus;
        this.toFollowUpCount = toFollowUpCount;
        this.toFollowUp = toFollowUp;
        this.recentApplications = recentApplications;
    }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public long getToFollowUpCount() { return toFollowUpCount; }
    public List<FollowUpItem> getToFollowUp() { return toFollowUp; }
    public List<RecentApplicationItem> getRecentApplications() { return recentApplications; }
}
