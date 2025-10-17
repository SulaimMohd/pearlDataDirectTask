package com.pearldata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @NotNull(message = "Event is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @NotNull(message = "Attendance status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;

    @Column(name = "marks_obtained")
    private Double marksObtained;

    @Column(name = "max_marks")
    private Double maxMarks;

    @Column(length = 500)
    private String remarks;

    @NotNull(message = "Marked by faculty is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marked_by_faculty_id", nullable = false)
    private User markedByFaculty;

    @CreationTimestamp
    @Column(name = "marked_at", nullable = false, updatable = false)
    private LocalDateTime markedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Attendance() {}

    public Attendance(Student student, Event event, AttendanceStatus status, 
                     Double marksObtained, Double maxMarks, String remarks, User markedByFaculty) {
        this.student = student;
        this.event = event;
        this.status = status;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks;
        this.remarks = remarks;
        this.markedByFaculty = markedByFaculty;
    }

    // Enums
    public enum AttendanceStatus {
        PRESENT("Present"),
        ABSENT("Absent"),
        LATE("Late"),
        EXCUSED("Excused"),
        PARTIAL("Partial");

        private final String displayName;

        AttendanceStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
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

    public User getMarkedByFaculty() {
        return markedByFaculty;
    }

    public void setMarkedByFaculty(User markedByFaculty) {
        this.markedByFaculty = markedByFaculty;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public Double getPercentage() {
        if (maxMarks == null || maxMarks == 0 || marksObtained == null) {
            return null;
        }
        return (marksObtained / maxMarks) * 100;
    }

    public boolean isPresent() {
        return status == AttendanceStatus.PRESENT || status == AttendanceStatus.LATE;
    }

    public String getStatusDisplayName() {
        return status.getDisplayName();
    }

    @Override
    public String toString() {
        return "Attendance{" +
                "id=" + id +
                ", student=" + (student != null ? student.getName() : "null") +
                ", event=" + (event != null ? event.getTitle() : "null") +
                ", status=" + status +
                ", marksObtained=" + marksObtained +
                ", maxMarks=" + maxMarks +
                ", markedAt=" + markedAt +
                '}';
    }
}
