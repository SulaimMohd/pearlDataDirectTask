package com.pearldata.dto;

import java.time.LocalDateTime;

public class StudentAttendanceDetailDTO {
    private Long attendanceId;
    private Long eventId;
    private String eventTitle;
    private String eventType;
    private LocalDateTime eventDate;
    private String eventLocation;
    private String attendanceStatus;
    private Double marksObtained;
    private Double maxMarks;
    private String remarks;
    private LocalDateTime markedAt;
    private String markedByFaculty;
    
    // Constructors
    public StudentAttendanceDetailDTO() {}
    
    public StudentAttendanceDetailDTO(Long attendanceId, Long eventId, String eventTitle, 
                                   String eventType, LocalDateTime eventDate, String eventLocation,
                                   String attendanceStatus, Double marksObtained, Double maxMarks,
                                   String remarks, LocalDateTime markedAt, String markedByFaculty) {
        this.attendanceId = attendanceId;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.eventLocation = eventLocation;
        this.attendanceStatus = attendanceStatus;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks;
        this.remarks = remarks;
        this.markedAt = markedAt;
        this.markedByFaculty = markedByFaculty;
    }
    
    // Getters and Setters
    public Long getAttendanceId() {
        return attendanceId;
    }
    
    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
    }
    
    public Long getEventId() {
        return eventId;
    }
    
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    
    public String getEventTitle() {
        return eventTitle;
    }
    
    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }
    
    public String getEventType() {
        return eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
    
    public LocalDateTime getEventDate() {
        return eventDate;
    }
    
    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }
    
    public String getEventLocation() {
        return eventLocation;
    }
    
    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }
    
    public String getAttendanceStatus() {
        return attendanceStatus;
    }
    
    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
    
    public Double getMarksObtained() {
        return marksObtained;
    }
    
    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }
    
    public Double getMaxMarks() {
        return maxMarks;
    }
    
    public void setMaxMarks(Double maxMarks) {
        this.maxMarks = maxMarks;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public LocalDateTime getMarkedAt() {
        return markedAt;
    }
    
    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }
    
    public String getMarkedByFaculty() {
        return markedByFaculty;
    }
    
    public void setMarkedByFaculty(String markedByFaculty) {
        this.markedByFaculty = markedByFaculty;
    }
    
    // Helper methods
    public Double getMarksPercentage() {
        if (marksObtained != null && maxMarks != null && maxMarks > 0) {
            return (marksObtained / maxMarks) * 100;
        }
        return null;
    }
    
    public String getPerformanceStatus() {
        Double percentage = getMarksPercentage();
        if (percentage != null) {
            if (percentage >= 90) return "Excellent";
            if (percentage >= 80) return "Good";
            if (percentage >= 70) return "Average";
            if (percentage >= 60) return "Below Average";
            return "Poor";
        }
        return "No Marks";
    }
}
