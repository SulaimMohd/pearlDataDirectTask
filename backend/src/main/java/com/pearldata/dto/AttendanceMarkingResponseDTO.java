package com.pearldata.dto;

import com.pearldata.entity.Attendance;
import com.pearldata.entity.Event;

import java.time.LocalDateTime;
import java.util.List;

public class AttendanceMarkingResponseDTO {

    private boolean success;
    private String message;
    private AttendanceSummary attendanceSummary;
    private EventSummary eventSummary;
    private List<AttendanceRecord> attendanceRecords;

    // Constructors
    public AttendanceMarkingResponseDTO() {}

    public AttendanceMarkingResponseDTO(boolean success, String message, AttendanceSummary attendanceSummary, 
                                      EventSummary eventSummary, List<AttendanceRecord> attendanceRecords) {
        this.success = success;
        this.message = message;
        this.attendanceSummary = attendanceSummary;
        this.eventSummary = eventSummary;
        this.attendanceRecords = attendanceRecords;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AttendanceSummary getAttendanceSummary() {
        return attendanceSummary;
    }

    public void setAttendanceSummary(AttendanceSummary attendanceSummary) {
        this.attendanceSummary = attendanceSummary;
    }

    public EventSummary getEventSummary() {
        return eventSummary;
    }

    public void setEventSummary(EventSummary eventSummary) {
        this.eventSummary = eventSummary;
    }

    public List<AttendanceRecord> getAttendanceRecords() {
        return attendanceRecords;
    }

    public void setAttendanceRecords(List<AttendanceRecord> attendanceRecords) {
        this.attendanceRecords = attendanceRecords;
    }

    // Inner classes
    public static class AttendanceSummary {
        private int totalStudents;
        private int presentCount;
        private int absentCount;
        private int lateCount;
        private double attendancePercentage;
        private double averageMarks;

        // Constructors
        public AttendanceSummary() {}

        public AttendanceSummary(int totalStudents, int presentCount, int absentCount, int lateCount, 
                               double attendancePercentage, double averageMarks) {
            this.totalStudents = totalStudents;
            this.presentCount = presentCount;
            this.absentCount = absentCount;
            this.lateCount = lateCount;
            this.attendancePercentage = attendancePercentage;
            this.averageMarks = averageMarks;
        }

        // Getters and Setters
        public int getTotalStudents() {
            return totalStudents;
        }

        public void setTotalStudents(int totalStudents) {
            this.totalStudents = totalStudents;
        }

        public int getPresentCount() {
            return presentCount;
        }

        public void setPresentCount(int presentCount) {
            this.presentCount = presentCount;
        }

        public int getAbsentCount() {
            return absentCount;
        }

        public void setAbsentCount(int absentCount) {
            this.absentCount = absentCount;
        }

        public int getLateCount() {
            return lateCount;
        }

        public void setLateCount(int lateCount) {
            this.lateCount = lateCount;
        }

        public double getAttendancePercentage() {
            return attendancePercentage;
        }

        public void setAttendancePercentage(double attendancePercentage) {
            this.attendancePercentage = attendancePercentage;
        }

        public double getAverageMarks() {
            return averageMarks;
        }

        public void setAverageMarks(double averageMarks) {
            this.averageMarks = averageMarks;
        }
    }

    public static class EventSummary {
        private Long eventId;
        private String eventTitle;
        private Event.EventStatus previousStatus;
        private Event.EventStatus currentStatus;
        private boolean statusChanged;
        private LocalDateTime markedAt;

        // Constructors
        public EventSummary() {}

        public EventSummary(Long eventId, String eventTitle, Event.EventStatus previousStatus, 
                          Event.EventStatus currentStatus, boolean statusChanged, LocalDateTime markedAt) {
            this.eventId = eventId;
            this.eventTitle = eventTitle;
            this.previousStatus = previousStatus;
            this.currentStatus = currentStatus;
            this.statusChanged = statusChanged;
            this.markedAt = markedAt;
        }

        // Getters and Setters
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

        public Event.EventStatus getPreviousStatus() {
            return previousStatus;
        }

        public void setPreviousStatus(Event.EventStatus previousStatus) {
            this.previousStatus = previousStatus;
        }

        public Event.EventStatus getCurrentStatus() {
            return currentStatus;
        }

        public void setCurrentStatus(Event.EventStatus currentStatus) {
            this.currentStatus = currentStatus;
        }

        public boolean isStatusChanged() {
            return statusChanged;
        }

        public void setStatusChanged(boolean statusChanged) {
            this.statusChanged = statusChanged;
        }

        public LocalDateTime getMarkedAt() {
            return markedAt;
        }

        public void setMarkedAt(LocalDateTime markedAt) {
            this.markedAt = markedAt;
        }
    }

    public static class AttendanceRecord {
        private Long studentId;
        private String studentName;
        private Attendance.AttendanceStatus status;
        private Double marksObtained;
        private Double maxMarks;
        private Double percentage;
        private String remarks;

        // Constructors
        public AttendanceRecord() {}

        public AttendanceRecord(Long studentId, String studentName, Attendance.AttendanceStatus status, 
                              Double marksObtained, Double maxMarks, Double percentage, String remarks) {
            this.studentId = studentId;
            this.studentName = studentName;
            this.status = status;
            this.marksObtained = marksObtained;
            this.maxMarks = maxMarks;
            this.percentage = percentage;
            this.remarks = remarks;
        }

        // Getters and Setters
        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public Attendance.AttendanceStatus getStatus() {
            return status;
        }

        public void setStatus(Attendance.AttendanceStatus status) {
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

        public Double getPercentage() {
            return percentage;
        }

        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }
}
