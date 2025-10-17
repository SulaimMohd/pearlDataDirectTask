package com.pearldata.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class AttendanceRequest {
    
    @NotNull(message = "Event ID is required")
    private Long eventId;
    
    @NotNull(message = "Attendance records are required")
    private List<AttendanceRecord> attendanceRecords;
    
    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }
    
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    
    public List<AttendanceRecord> getAttendanceRecords() {
        return attendanceRecords;
    }
    
    public void setAttendanceRecords(List<AttendanceRecord> attendanceRecords) {
        this.attendanceRecords = attendanceRecords;
    }
    
    // Inner class for individual attendance records
    public static class AttendanceRecord {
        @NotNull(message = "Student ID is required")
        private Long studentId;
        
        @NotNull(message = "Attendance status is required")
        private String status; // PRESENT, ABSENT, LATE, EXCUSED
        
        private String remarks;
        
        // Getters and Setters
        public Long getStudentId() {
            return studentId;
        }
        
        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public String getRemarks() {
            return remarks;
        }
        
        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }
}
