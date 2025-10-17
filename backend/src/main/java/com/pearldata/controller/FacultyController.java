package com.pearldata.controller;

import com.pearldata.dto.AttendanceRequest;
import com.pearldata.dto.EventRequest;
import com.pearldata.entity.User;
import com.pearldata.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    @Autowired
    private UserService userService;

    // Helper method to get current faculty user
    private Map<String, Object> getCurrentFaculty() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userService.getUserByEmail(email).map(user -> {
            Map<String, Object> faculty = new HashMap<>();
            faculty.put("id", user.getId());
            faculty.put("name", user.getName());
            faculty.put("email", user.getEmail());
            return faculty;
        }).orElse(null);
    }

    // Get all students (users with STUDENT role)
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<User> allUsers = userService.getAllUsers();
            List<User> students = allUsers.stream()
                    .filter(user -> user.getRole() == User.Role.STUDENT)
                    .toList();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch students: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Search students
    @GetMapping("/students/search")
    public ResponseEntity<?> searchStudents(@RequestParam String q) {
        try {
            List<User> allUsers = userService.getAllUsers();
            List<User> students = allUsers.stream()
                    .filter(user -> user.getRole() == User.Role.STUDENT)
                    .filter(user -> user.getName().toLowerCase().contains(q.toLowerCase()) ||
                                   user.getEmail().toLowerCase().contains(q.toLowerCase()))
                    .toList();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to search students: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Create an event (stored as JSON in faculty's bio field for simplicity)
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventRequest request) {
        try {
            Map<String, Object> faculty = getCurrentFaculty();
            if (faculty == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Faculty not found"));
            }

            // For simplicity, we'll store events as a simple map in the faculty's bio
            // In a real application, you'd have a separate Event entity
            Map<String, Object> event = new HashMap<>();
            event.put("id", System.currentTimeMillis()); // Simple ID generation
            event.put("title", request.getTitle());
            event.put("description", request.getDescription());
            event.put("startTime", request.getStartTime().toString());
            event.put("endTime", request.getEndTime().toString());
            event.put("location", request.getLocation());
            event.put("eventType", request.getEventType());
            event.put("facultyId", faculty.get("id"));
            event.put("facultyName", faculty.get("name"));
            event.put("createdAt", LocalDateTime.now().toString());
            event.put("status", "SCHEDULED");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Event created successfully");
            response.put("event", event);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create event: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get faculty's events (mock implementation)
    @GetMapping("/events")
    public ResponseEntity<?> getFacultyEvents() {
        try {
            Map<String, Object> faculty = getCurrentFaculty();
            if (faculty == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Faculty not found"));
            }

            // Mock events for demonstration
            List<Map<String, Object>> events = List.of(
                Map.of(
                    "id", 1L,
                    "title", "Mathematics Lecture",
                    "description", "Advanced calculus topics",
                    "startTime", LocalDateTime.now().plusHours(2).toString(),
                    "endTime", LocalDateTime.now().plusHours(4).toString(),
                    "location", "Room 101",
                    "eventType", "LECTURE",
                    "status", "SCHEDULED"
                ),
                Map.of(
                    "id", 2L,
                    "title", "Physics Lab",
                    "description", "Mechanics experiments",
                    "startTime", LocalDateTime.now().plusDays(1).toString(),
                    "endTime", LocalDateTime.now().plusDays(1).plusHours(3).toString(),
                    "location", "Lab 205",
                    "eventType", "LAB",
                    "status", "SCHEDULED"
                )
            );
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch events: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Mark attendance (mock implementation)
    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        try {
            Map<String, Object> faculty = getCurrentFaculty();
            if (faculty == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Faculty not found"));
            }

            int presentCount = 0;
            int absentCount = 0;
            
            for (AttendanceRequest.AttendanceRecord record : request.getAttendanceRecords()) {
                if ("PRESENT".equals(record.getStatus())) {
                    presentCount++;
                } else {
                    absentCount++;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Attendance marked successfully");
            response.put("presentCount", presentCount);
            response.put("absentCount", absentCount);
            response.put("totalStudents", request.getAttendanceRecords().size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to mark attendance: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get student analytics (mock implementation)
    @GetMapping("/students/{studentId}/analytics")
    public ResponseEntity<?> getStudentAnalytics(@PathVariable Long studentId) {
        try {
            Optional<User> studentOpt = userService.getUserById(studentId);
            if (studentOpt.isEmpty() || studentOpt.get().getRole() != User.Role.STUDENT) {
                return ResponseEntity.notFound().build();
            }

            User student = studentOpt.get();
            
            // Mock analytics data
            Map<String, Object> analytics = new HashMap<>();
            analytics.put("studentId", student.getId());
            analytics.put("studentName", student.getName());
            analytics.put("studentEmail", student.getEmail());
            analytics.put("totalPresentHours", 45);
            analytics.put("totalAbsentHours", 5);
            analytics.put("totalEvents", 10);
            analytics.put("attendancePercentage", 90.0);
            analytics.put("lastAttendance", LocalDateTime.now().minusDays(1).toString());
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch student analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all students with their analytics
    @GetMapping("/students/analytics")
    public ResponseEntity<?> getAllStudentsAnalytics() {
        try {
            List<User> allUsers = userService.getAllUsers();
            List<User> students = allUsers.stream()
                    .filter(user -> user.getRole() == User.Role.STUDENT)
                    .toList();

            List<Map<String, Object>> analyticsList = students.stream().map(student -> {
                Map<String, Object> analytics = new HashMap<>();
                analytics.put("studentId", student.getId());
                analytics.put("studentName", student.getName());
                analytics.put("studentEmail", student.getEmail());
                analytics.put("totalPresentHours", 45 + (student.getId() % 10)); // Mock data
                analytics.put("totalAbsentHours", 5 + (student.getId() % 3)); // Mock data
                analytics.put("totalEvents", 10 + (student.getId() % 5)); // Mock data
                analytics.put("attendancePercentage", 85.0 + (student.getId() % 15)); // Mock data
                return analytics;
            }).toList();

            return ResponseEntity.ok(analyticsList);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch students analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
