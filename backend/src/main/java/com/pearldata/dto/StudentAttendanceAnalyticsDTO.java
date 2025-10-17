package com.pearldata.dto;

import java.time.LocalDateTime;

public class StudentAttendanceAnalyticsDTO {
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentIdNumber;
    private String department;
    private String course;
    private String academicYear;
    private String semester;
    
    // Attendance Statistics
    private long totalEvents;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long excusedCount;
    private double attendancePercentage;
    private double averageMarks;
    
    // Recent Activity
    private LocalDateTime lastAttendanceDate;
    private String lastAttendanceStatus;
    private String lastAttendanceEvent;
    
    // Performance Metrics
    private String performanceGrade;
    private String attendanceStatus; // Excellent, Good, Average, Poor
    
    // Constructors
    public StudentAttendanceAnalyticsDTO() {}
    
    public StudentAttendanceAnalyticsDTO(Long studentId, String studentName, String studentEmail, 
                                       String studentIdNumber, String department, String course,
                                       String academicYear, String semester) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentIdNumber = studentIdNumber;
        this.department = department;
        this.course = course;
        this.academicYear = academicYear;
        this.semester = semester;
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
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }
    
    public String getStudentIdNumber() {
        return studentIdNumber;
    }
    
    public void setStudentIdNumber(String studentIdNumber) {
        this.studentIdNumber = studentIdNumber;
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
    
    public long getTotalEvents() {
        return totalEvents;
    }
    
    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }
    
    public long getPresentCount() {
        return presentCount;
    }
    
    public void setPresentCount(long presentCount) {
        this.presentCount = presentCount;
    }
    
    public long getAbsentCount() {
        return absentCount;
    }
    
    public void setAbsentCount(long absentCount) {
        this.absentCount = absentCount;
    }
    
    public long getLateCount() {
        return lateCount;
    }
    
    public void setLateCount(long lateCount) {
        this.lateCount = lateCount;
    }
    
    public long getExcusedCount() {
        return excusedCount;
    }
    
    public void setExcusedCount(long excusedCount) {
        this.excusedCount = excusedCount;
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
    
    public LocalDateTime getLastAttendanceDate() {
        return lastAttendanceDate;
    }
    
    public void setLastAttendanceDate(LocalDateTime lastAttendanceDate) {
        this.lastAttendanceDate = lastAttendanceDate;
    }
    
    public String getLastAttendanceStatus() {
        return lastAttendanceStatus;
    }
    
    public void setLastAttendanceStatus(String lastAttendanceStatus) {
        this.lastAttendanceStatus = lastAttendanceStatus;
    }
    
    public String getLastAttendanceEvent() {
        return lastAttendanceEvent;
    }
    
    public void setLastAttendanceEvent(String lastAttendanceEvent) {
        this.lastAttendanceEvent = lastAttendanceEvent;
    }
    
    public String getPerformanceGrade() {
        return performanceGrade;
    }
    
    public void setPerformanceGrade(String performanceGrade) {
        this.performanceGrade = performanceGrade;
    }
    
    public String getAttendanceStatus() {
        return attendanceStatus;
    }
    
    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
    
    // Helper methods
    public void calculateAttendancePercentage() {
        if (totalEvents > 0) {
            this.attendancePercentage = ((double) (presentCount + lateCount) / totalEvents) * 100;
        } else {
            this.attendancePercentage = 0.0;
        }
    }
    
    public void determineAttendanceStatus() {
        if (attendancePercentage >= 90) {
            this.attendanceStatus = "Excellent";
            this.performanceGrade = "A";
        } else if (attendancePercentage >= 80) {
            this.attendanceStatus = "Good";
            this.performanceGrade = "B";
        } else if (attendancePercentage >= 70) {
            this.attendanceStatus = "Average";
            this.performanceGrade = "C";
        } else {
            this.attendanceStatus = "Poor";
            this.performanceGrade = "D";
        }
    }
}
