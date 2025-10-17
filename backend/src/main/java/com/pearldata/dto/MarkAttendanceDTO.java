package com.pearldata.dto;

import com.pearldata.entity.Attendance;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class MarkAttendanceDTO {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotEmpty(message = "Attendance records are required")
    @Valid
    private List<AttendanceRecordDTO> attendanceRecords;

    // Constructors
    public MarkAttendanceDTO() {}

    public MarkAttendanceDTO(Long eventId, List<AttendanceRecordDTO> attendanceRecords) {
        this.eventId = eventId;
        this.attendanceRecords = attendanceRecords;
    }

    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public List<AttendanceRecordDTO> getAttendanceRecords() {
        return attendanceRecords;
    }

    public void setAttendanceRecords(List<AttendanceRecordDTO> attendanceRecords) {
        this.attendanceRecords = attendanceRecords;
    }

    @Override
    public String toString() {
        return "MarkAttendanceDTO{" +
                "eventId=" + eventId +
                ", attendanceRecords=" + attendanceRecords +
                '}';
    }

    // Inner class for individual attendance records
    public static class AttendanceRecordDTO {

        @NotNull(message = "Student ID is required")
        private Long studentId;

        @NotNull(message = "Attendance status is required")
        private Attendance.AttendanceStatus status;

        private Double marksObtained;

        private Double maxMarks;

        private String remarks;

        // Constructors
        public AttendanceRecordDTO() {}

        public AttendanceRecordDTO(Long studentId, Attendance.AttendanceStatus status, 
                                  Double marksObtained, Double maxMarks, String remarks) {
            this.studentId = studentId;
            this.status = status;
            this.marksObtained = marksObtained;
            this.maxMarks = maxMarks;
            this.remarks = remarks;
        }

        // Getters and Setters
        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
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

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        // Validation methods
        public boolean hasValidMarks() {
            if (marksObtained == null || maxMarks == null) {
                return true; // Marks are optional
            }
            return marksObtained >= 0 && maxMarks > 0 && marksObtained <= maxMarks;
        }

        public Double getPercentage() {
            if (maxMarks == null || maxMarks == 0 || marksObtained == null) {
                return null;
            }
            return (marksObtained / maxMarks) * 100;
        }

        public boolean isPresent() {
            return status == Attendance.AttendanceStatus.PRESENT || 
                   status == Attendance.AttendanceStatus.LATE;
        }

        @Override
        public String toString() {
            return "AttendanceRecordDTO{" +
                    "studentId=" + studentId +
                    ", status=" + status +
                    ", marksObtained=" + marksObtained +
                    ", maxMarks=" + maxMarks +
                    ", remarks='" + remarks + '\'' +
                    '}';
        }
    }
}
