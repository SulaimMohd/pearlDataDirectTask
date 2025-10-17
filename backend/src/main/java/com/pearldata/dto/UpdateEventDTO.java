package com.pearldata.dto;

import com.pearldata.entity.Event;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UpdateEventDTO {

    @Size(min = 3, max = 100, message = "Event title must be between 3 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private Event.EventType eventType;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    private Event.EventStatus status;

    // Constructors
    public UpdateEventDTO() {}

    public UpdateEventDTO(String title, String description, Event.EventType eventType, 
                         LocalDateTime startTime, LocalDateTime endTime, String location, Event.EventStatus status) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.status = status;
    }

    // Getters and Setters
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

    // Validation methods
    public boolean hasValidTimeRange() {
        return startTime == null || endTime == null || endTime.isAfter(startTime);
    }

    public boolean hasTimeRange() {
        return startTime != null && endTime != null;
    }

    public long getDurationInMinutes() {
        if (hasTimeRange()) {
            return java.time.Duration.between(startTime, endTime).toMinutes();
        }
        return 0;
    }

    @Override
    public String toString() {
        return "UpdateEventDTO{" +
                "title='" + title + '\'' +
                ", eventType=" + eventType +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", location='" + location + '\'' +
                ", status=" + status +
                '}';
    }
}
