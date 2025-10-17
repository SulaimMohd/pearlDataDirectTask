package com.pearldata.dto;

import com.pearldata.entity.Student;

import java.time.LocalDateTime;

public class StudentResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String bio;
    private String studentId;
    private String department;
    private String course;
    private String academicYear;
    private String semester;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Attendance statistics
    private Long totalAttendanceRecords;
    private Long presentCount;
    private Long absentCount;
    private Long lateCount;
    private Long excusedCount;
    private Double attendancePercentage;
    
    // Academic statistics
    private Double averageMarks;
    private Long totalEventsAttended;
    private Long totalEvents;

    // Constructors
    public StudentResponseDTO() {}

    public StudentResponseDTO(Student student) {
        this.id = student.getId();
        this.name = student.getName();
        this.email = student.getEmail();
        this.phoneNumber = student.getPhoneNumber();
        this.bio = student.getBio();
        this.studentId = student.getStudentId();
        this.department = student.getDepartment();
        this.course = student.getCourse();
        this.academicYear = student.getAcademicYear();
        this.semester = student.getSemester();
        this.isActive = student.getIsActive();
        this.createdAt = student.getCreatedAt();
        this.updatedAt = student.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(Double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public Long getTotalEventsAttended() {
        return totalEventsAttended;
    }

    public void setTotalEventsAttended(Long totalEventsAttended) {
        this.totalEventsAttended = totalEventsAttended;
    }

    public Long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(Long totalEvents) {
        this.totalEvents = totalEvents;
    }

    // Helper methods
    public String getFullInfo() {
        return String.format("%s (%s) - %s %s", name, studentId, department, course);
    }

    public String getAcademicInfo() {
        return String.format("%s - %s %s %s", studentId, department, course, academicYear);
    }

    public String getAttendanceStatus() {
        if (attendancePercentage == null) {
            return "No Data";
        }
        if (attendancePercentage >= 90) {
            return "Excellent";
        } else if (attendancePercentage >= 80) {
            return "Good";
        } else if (attendancePercentage >= 70) {
            return "Average";
        } else if (attendancePercentage >= 60) {
            return "Below Average";
        } else {
            return "Poor";
        }
    }

    public String getFormattedAttendancePercentage() {
        if (attendancePercentage == null) {
            return "N/A";
        }
        return String.format("%.1f%%", attendancePercentage);
    }

    public String getFormattedAverageMarks() {
        if (averageMarks == null) {
            return "N/A";
        }
        return String.format("%.2f", averageMarks);
    }

    @Override
    public String toString() {
        return "StudentResponseDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", studentId='" + studentId + '\'' +
                ", department='" + department + '\'' +
                ", course='" + course + '\'' +
                ", attendancePercentage=" + attendancePercentage +
                '}';
    }
}
