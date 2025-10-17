package com.pearldata.dto;

import com.pearldata.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AdminCreateStudentDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+91[6-9]\\d{9}$", message = "Phone number must be a valid Indian mobile number starting with +91")
    private String phoneNumber;

    private String bio;

    @NotBlank(message = "Student ID is required")
    @Size(min = 5, max = 20, message = "Student ID must be between 5 and 20 characters")
    private String studentId;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotBlank(message = "Semester is required")
    private String semester;

    // Constructors
    public AdminCreateStudentDTO() {}

    public AdminCreateStudentDTO(String name, String email, String password, String phoneNumber, 
                                String bio, String studentId, String department, String course, 
                                String academicYear, String semester) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
        this.studentId = studentId;
        this.department = department;
        this.course = course;
        this.academicYear = academicYear;
        this.semester = semester;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    // Convert to User entity for user creation
    public User toUser() {
        User user = new User();
        user.setName(this.name);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setPhoneNumber(this.phoneNumber);
        user.setBio(this.bio);
        user.setRole(User.Role.STUDENT);
        return user;
    }

    // Convert to CreateStudentDTO for student creation
    public CreateStudentDTO toCreateStudentDTO() {
        return new CreateStudentDTO(
            this.name,
            this.email,
            this.phoneNumber,
            this.bio,
            this.studentId,
            this.department,
            this.course,
            this.academicYear,
            this.semester
        );
    }

    @Override
    public String toString() {
        return "AdminCreateStudentDTO{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", bio='" + bio + '\'' +
                ", studentId='" + studentId + '\'' +
                ", department='" + department + '\'' +
                ", course='" + course + '\'' +
                ", academicYear='" + academicYear + '\'' +
                ", semester='" + semester + '\'' +
                '}';
    }
}
