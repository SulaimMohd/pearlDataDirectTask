package com.pearldata.dto;

import com.pearldata.entity.Event;

import java.time.LocalDateTime;

public class EventResponseDTO {

    private Long id;
    private String title;
    private String description;
    private Event.EventType eventType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private Event.EventStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Faculty information
    private Long facultyId;
    private String facultyName;
    private String facultyEmail;
    
    // Statistics
    private long durationInMinutes;
    private boolean isActive;
    private boolean isUpcoming;
    private boolean isCompleted;
    private boolean isCancelled;
    
    // Attendance statistics
    private Long totalAttendanceRecords;
    private Long presentCount;
    private Long absentCount;
    private Long lateCount;
    private Long excusedCount;
    private Double attendancePercentage;

    // Constructors
    public EventResponseDTO() {}

    public EventResponseDTO(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.eventType = event.getEventType();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.location = event.getLocation();
        this.status = event.getStatus();
        this.createdAt = event.getCreatedAt();
        this.updatedAt = event.getUpdatedAt();
        
        // Faculty information
        if (event.getFaculty() != null) {
            this.facultyId = event.getFaculty().getId();
            this.facultyName = event.getFaculty().getName();
            this.facultyEmail = event.getFaculty().getEmail();
        }
        
        // Calculate statistics
        this.durationInMinutes = event.getDurationInMinutes();
        this.isActive = event.isActive();
        
        LocalDateTime now = LocalDateTime.now();
        this.isUpcoming = event.getStartTime().isAfter(now) && event.getStatus() == Event.EventStatus.SCHEDULED;
        this.isCompleted = event.getEndTime().isBefore(now) || event.getStatus() == Event.EventStatus.COMPLETED;
        this.isCancelled = event.getStatus() == Event.EventStatus.CANCELLED;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Event.EventType getEventType() {
        return eventType;
    }

    public void setEventType(Event.EventType eventType) {
        this.eventType = eventType;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Event.EventStatus getStatus() {
        return status;
    }

    public void setStatus(Event.EventStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getFacultyEmail() {
        return facultyEmail;
    }

    public void setFacultyEmail(String facultyEmail) {
        this.facultyEmail = facultyEmail;
    }

    public long getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(long durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isUpcoming() {
        return isUpcoming;
    }

    public void setUpcoming(boolean upcoming) {
        isUpcoming = upcoming;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public boolean isCancelled() {
        return isCancelled;
    }

    public void setCancelled(boolean cancelled) {
        isCancelled = cancelled;
    }

    public Long getTotalAttendanceRecords() {
        return totalAttendanceRecords;
    }

    public void setTotalAttendanceRecords(Long totalAttendanceRecords) {
        this.totalAttendanceRecords = totalAttendanceRecords;
    }

    public Long getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(Long presentCount) {
        this.presentCount = presentCount;
    }

    public Long getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(Long absentCount) {
        this.absentCount = absentCount;
    }

    public Long getLateCount() {
        return lateCount;
    }

    public void setLateCount(Long lateCount) {
        this.lateCount = lateCount;
    }

    public Long getExcusedCount() {
        return excusedCount;
    }

    public void setExcusedCount(Long excusedCount) {
        this.excusedCount = excusedCount;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    // Helper methods
    public String getDurationFormatted() {
        long hours = durationInMinutes / 60;
        long minutes = durationInMinutes % 60;
        if (hours > 0) {
            return String.format("%dh %dm", hours, minutes);
        }
        return String.format("%dm", minutes);
    }

    public String getStatusDisplayName() {
        switch (status) {
            case SCHEDULED:
                return isUpcoming() ? "Upcoming" : "Scheduled";
            case ONGOING:
                return "Ongoing";
            case COMPLETED:
                return "Completed";
            case CANCELLED:
                return "Cancelled";
            default:
                return status.toString();
        }
    }

    @Override
    public String toString() {
        return "EventResponseDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", eventType=" + eventType +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", location='" + location + '\'' +
                ", status=" + status +
                '}';
    }
}
