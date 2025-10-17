package com.pearldata.controller;

import com.pearldata.entity.Attendance;
import com.pearldata.entity.Event;
import com.pearldata.entity.Student;
import com.pearldata.entity.User;
import com.pearldata.service.AttendanceService;
import com.pearldata.service.EventService;
import com.pearldata.service.StudentService;
import com.pearldata.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private EventService eventService;

    @Autowired
    private AttendanceService attendanceService;

    // Helper method to get current student
    private User getCurrentStudent(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // Get student profile
    @GetMapping("/profile")
    public ResponseEntity<?> getStudentProfile(Authentication authentication) {
        try {
            User student = getCurrentStudent(authentication);
            
            // Get student details from Student entity
            Optional<Student> studentDetails = studentService.getStudentByEmail(student.getEmail())
                .map(dto -> studentService.getStudentEntityById(dto.getId()));
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", student.getId());
            profile.put("name", student.getName());
            profile.put("email", student.getEmail());
            profile.put("phoneNumber", student.getPhoneNumber());
            profile.put("bio", student.getBio());
            profile.put("role", student.getRole());
            profile.put("isActive", student.getIsActive());
            profile.put("createdAt", student.getCreatedAt());
            
            if (studentDetails.isPresent()) {
                Student studentInfo = studentDetails.get();
                profile.put("studentId", studentInfo.getStudentId());
                profile.put("department", studentInfo.getDepartment());
                profile.put("course", studentInfo.getCourse());
                profile.put("academicYear", studentInfo.getAcademicYear());
                profile.put("semester", studentInfo.getSemester());
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", profile
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching profile: " + e.getMessage()
            ));
        }
    }

    // Get dashboard statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        try {
            User student = getCurrentStudent(authentication);
            Optional<Student> studentDetails = studentService.getStudentByEmail(student.getEmail())
                .map(dto -> studentService.getStudentEntityById(dto.getId()));
            
            if (studentDetails.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Student details not found"
                ));
            }

            Student studentInfo = studentDetails.get();
            
            // Get attendance statistics
            List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(studentInfo);
            long totalEvents = attendanceRecords.size();
            long presentCount = attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
            long absentCount = attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                .count();
            long lateCount = attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE)
                .count();
            
            double attendancePercentage = totalEvents > 0 ? 
                ((double) (presentCount + lateCount) / totalEvents) * 100 : 0.0;
            
            // Get upcoming events
            long upcomingEvents = eventService.countUpcomingEvents();
            
            // Get average marks
            double averageMarks = attendanceRecords.stream()
                .filter(a -> a.getMarksObtained() != null)
                .mapToDouble(Attendance::getMarksObtained)
                .average()
                .orElse(0.0);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalEvents", totalEvents);
            stats.put("presentCount", presentCount);
            stats.put("absentCount", absentCount);
            stats.put("lateCount", lateCount);
            stats.put("attendancePercentage", Math.round(attendancePercentage * 100.0) / 100.0);
            stats.put("upcomingEvents", upcomingEvents);
            stats.put("averageMarks", Math.round(averageMarks * 100.0) / 100.0);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching dashboard stats: " + e.getMessage()
            ));
        }
    }

    // Get student's attendance records
    @GetMapping("/attendance")
    public ResponseEntity<?> getStudentAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "markedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            User student = getCurrentStudent(authentication);
            Optional<Student> studentDetails = studentService.getStudentByEmail(student.getEmail())
                .map(dto -> studentService.getStudentEntityById(dto.getId()));
            
            if (studentDetails.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Student details not found"
                ));
            }

            Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);

            List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(studentDetails.get());
            
            // Convert to response format
            List<Map<String, Object>> attendanceData = attendanceRecords.stream()
                .map(attendance -> {
                    Map<String, Object> record = new HashMap<>();
                    record.put("id", attendance.getId());
                    record.put("eventId", attendance.getEvent().getId());
                    record.put("eventTitle", attendance.getEvent().getTitle());
                    record.put("eventType", attendance.getEvent().getEventType().toString());
                    record.put("eventDate", attendance.getEvent().getStartTime());
                    record.put("eventLocation", attendance.getEvent().getLocation());
                    record.put("status", attendance.getStatus().toString());
                    record.put("marksObtained", attendance.getMarksObtained());
                    record.put("maxMarks", attendance.getMaxMarks());
                    record.put("remarks", attendance.getRemarks());
                    record.put("markedAt", attendance.getMarkedAt());
                    record.put("markedByFaculty", attendance.getMarkedByFaculty().getName());
                    return record;
                })
                .sorted((a, b) -> {
                    if (sortBy.equals("markedAt")) {
                        return sortDir.equals("desc") ?
                            ((String) b.get("markedAt")).compareTo((String) a.get("markedAt")) :
                            ((String) a.get("markedAt")).compareTo((String) b.get("markedAt"));
                    } else if (sortBy.equals("eventDate")) {
                        return sortDir.equals("desc") ?
                            ((String) b.get("eventDate")).compareTo((String) a.get("eventDate")) :
                            ((String) a.get("eventDate")).compareTo((String) b.get("eventDate"));
                    }
                    return 0;
                })
                .toList();

            // Apply pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), attendanceData.size());
            List<Map<String, Object>> paginatedData = attendanceData.subList(start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedData);
            response.put("totalElements", attendanceData.size());
            response.put("totalPages", (int) Math.ceil((double) attendanceData.size() / size));
            response.put("currentPage", page);
            response.put("size", size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching attendance: " + e.getMessage()
            ));
        }
    }

    // Get upcoming events
    @GetMapping("/events")
    public ResponseEntity<?> getUpcomingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        try {
            getCurrentStudent(authentication); // Just to verify authentication
            
            Sort sort = Sort.by("startTime").ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Event> events = eventService.getUpcomingEvents(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", events.getContent());
            response.put("totalElements", events.getTotalElements());
            response.put("totalPages", events.getTotalPages());
            response.put("currentPage", page);
            response.put("size", size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching events: " + e.getMessage()
            ));
        }
    }

    // Get student progress
    @GetMapping("/progress")
    public ResponseEntity<?> getStudentProgress(Authentication authentication) {
        try {
            User student = getCurrentStudent(authentication);
            Optional<Student> studentDetails = studentService.getStudentByEmail(student.getEmail())
                .map(dto -> studentService.getStudentEntityById(dto.getId()));
            
            if (studentDetails.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Student details not found"
                ));
            }

            Student studentInfo = studentDetails.get();
            List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(studentInfo);
            
            // Calculate progress metrics
            long totalEvents = attendanceRecords.size();
            long presentCount = attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
            long lateCount = attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE)
                .count();
            
            double attendanceRate = totalEvents > 0 ? 
                ((double) (presentCount + lateCount) / totalEvents) * 100 : 0.0;
            
            // Calculate grade based on attendance
            String grade;
            if (attendanceRate >= 90) grade = "A+";
            else if (attendanceRate >= 80) grade = "A";
            else if (attendanceRate >= 70) grade = "B+";
            else if (attendanceRate >= 60) grade = "B";
            else if (attendanceRate >= 50) grade = "C+";
            else grade = "C";
            
            // Get performance by subject/event type
            Map<String, Map<String, Object>> subjectPerformance = new HashMap<>();
            
            attendanceRecords.stream()
                .filter(a -> a.getEvent().getEventType() != null)
                .forEach(attendance -> {
                    String eventType = attendance.getEvent().getEventType().toString();
                    subjectPerformance.computeIfAbsent(eventType, k -> new HashMap<>());
                    
                    Map<String, Object> subjectStats = subjectPerformance.get(eventType);
                    subjectStats.put("totalEvents", (int) subjectStats.getOrDefault("totalEvents", 0) + 1);
                    
                    if (attendance.getStatus() == Attendance.AttendanceStatus.PRESENT || 
                        attendance.getStatus() == Attendance.AttendanceStatus.LATE) {
                        subjectStats.put("attended", (int) subjectStats.getOrDefault("attended", 0) + 1);
                    }
                    
                    if (attendance.getMarksObtained() != null) {
                        @SuppressWarnings("unchecked")
                        List<Double> marks = (List<Double>) subjectStats.getOrDefault("marks", new java.util.ArrayList<>());
                        marks.add(attendance.getMarksObtained());
                        subjectStats.put("marks", marks);
                    }
                });

            // Calculate average marks for each subject
            subjectPerformance.forEach((subject, stats) -> {
                @SuppressWarnings("unchecked")
                List<Double> marks = (List<Double>) stats.get("marks");
                if (marks != null && !marks.isEmpty()) {
                    double avgMarks = marks.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
                    stats.put("averageMarks", Math.round(avgMarks * 100.0) / 100.0);
                }
                
                int total = (int) stats.get("totalEvents");
                int attended = (int) stats.getOrDefault("attended", 0);
                double subjectAttendance = total > 0 ? ((double) attended / total) * 100 : 0.0;
                stats.put("attendanceRate", Math.round(subjectAttendance * 100.0) / 100.0);
            });

            Map<String, Object> progress = new HashMap<>();
            progress.put("overallAttendance", Math.round(attendanceRate * 100.0) / 100.0);
            progress.put("totalEvents", totalEvents);
            progress.put("presentCount", presentCount);
            progress.put("lateCount", lateCount);
            progress.put("grade", grade);
            progress.put("subjectPerformance", subjectPerformance);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", progress
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching progress: " + e.getMessage()
            ));
        }
    }

    // Update student profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateData, Authentication authentication) {
        try {
            User student = getCurrentStudent(authentication);
            
            // Update allowed fields
            if (updateData.containsKey("name")) {
                student.setName(updateData.get("name"));
            }
            if (updateData.containsKey("phoneNumber")) {
                student.setPhoneNumber(updateData.get("phoneNumber"));
            }
            if (updateData.containsKey("bio")) {
                student.setBio(updateData.get("bio"));
            }
            
            User updatedStudent = userService.saveUser(student);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile updated successfully",
                "data", updatedStudent
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error updating profile: " + e.getMessage()
            ));
        }
    }
}
