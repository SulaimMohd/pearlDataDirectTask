package com.pearldata.controller;

import com.pearldata.dto.*;
import com.pearldata.entity.Attendance;
import com.pearldata.entity.Student;
import com.pearldata.entity.User;
import com.pearldata.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private AttendanceService attendanceService;

    // Helper method to get current faculty user
    private User getCurrentFaculty() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    // ==================== DASHBOARD ====================

    // Get faculty dashboard statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            User faculty = getCurrentFaculty();
            
            long totalStudents = studentService.countAllStudents();
            long totalEvents = eventService.countEventsByFaculty(faculty.getId());
            long upcomingEvents = eventService.countUpcomingEventsByFaculty(faculty.getId());
            double avgAttendance = attendanceService.getAverageAttendanceRateByFaculty(faculty.getId());
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", totalStudents);
            stats.put("totalEvents", totalEvents);
            stats.put("upcomingEvents", upcomingEvents);
            stats.put("attendanceRate", String.format("%.2f", avgAttendance));
            
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

    // ==================== EVENT MANAGEMENT ====================

    // Create event
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateEventDTO createEventDTO) {
        try {
            User faculty = getCurrentFaculty();
            EventResponseDTO event = eventService.createEvent(createEventDTO, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event created successfully",
                "data", event
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get all events by faculty
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            User faculty = getCurrentFaculty();
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<EventResponseDTO> events = eventService.getEventsByFaculty(faculty.getId(), pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", events.getContent(),
                "totalElements", events.getTotalElements(),
                "totalPages", events.getTotalPages(),
                "currentPage", events.getNumber(),
                "size", events.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get event by ID
    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable Long eventId) {
        try {
            Optional<EventResponseDTO> event = eventService.getEventByIdWithAttendance(eventId);
            if (event.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", event.get()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Update event
    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @Valid @RequestBody UpdateEventDTO updateEventDTO) {
        try {
            User faculty = getCurrentFaculty();
            EventResponseDTO event = eventService.updateEvent(eventId, updateEventDTO, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event updated successfully",
                "data", event
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Delete event
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        try {
            User faculty = getCurrentFaculty();
            eventService.deleteEvent(eventId, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get upcoming events
    @GetMapping("/events/upcoming")
    public ResponseEntity<?> getUpcomingEvents() {
        try {
            User faculty = getCurrentFaculty();
            List<EventResponseDTO> events = eventService.getUpcomingEventsByFaculty(faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", events
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get current events
    @GetMapping("/events/current")
    public ResponseEntity<?> getCurrentEvents() {
        try {
            User faculty = getCurrentFaculty();
            List<EventResponseDTO> events = eventService.getCurrentEventsByFaculty(faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", events
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get completed events
    @GetMapping("/events/completed")
    public ResponseEntity<?> getCompletedEvents() {
        try {
            User faculty = getCurrentFaculty();
            List<EventResponseDTO> events = eventService.getCompletedEventsByFaculty(faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", events
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Search events
    @GetMapping("/events/search")
    public ResponseEntity<?> searchEvents(@RequestParam String query) {
        try {
            User faculty = getCurrentFaculty();
            List<EventResponseDTO> events = eventService.searchEventsByFaculty(faculty.getId(), query);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", events
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get event statistics
    @GetMapping("/events/statistics")
    public ResponseEntity<?> getEventStatistics() {
        try {
            User faculty = getCurrentFaculty();
            EventService.EventStatisticsDTO stats = eventService.getEventStatisticsByFaculty(faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ==================== STUDENT MANAGEMENT ====================

    // Get all students
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<StudentResponseDTO> students = studentService.getStudents(pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", students.getContent(),
                "totalElements", students.getTotalElements(),
                "totalPages", students.getTotalPages(),
                "currentPage", students.getNumber(),
                "size", students.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get student by ID
    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Long studentId) {
        try {
            Optional<StudentResponseDTO> student = studentService.getStudentByIdWithAttendance(studentId);
            if (student.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", student.get()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Search students by name
    @GetMapping("/students/search")
    public ResponseEntity<?> searchStudentsByName(@RequestParam String query) {
        try {
            List<StudentResponseDTO> students = studentService.searchStudentsByName(query);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", students
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get students by department
    @GetMapping("/students/department/{department}")
    public ResponseEntity<?> getStudentsByDepartment(@PathVariable String department) {
        try {
            List<StudentResponseDTO> students = studentService.getStudentsByDepartment(department);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", students
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get students by course
    @GetMapping("/students/course/{course}")
    public ResponseEntity<?> getStudentsByCourse(@PathVariable String course) {
        try {
            List<StudentResponseDTO> students = studentService.getStudentsByCourse(course);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", students
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get students with attendance statistics
    @GetMapping("/students/statistics")
    public ResponseEntity<?> getStudentsWithStatistics() {
        try {
            List<StudentResponseDTO> students = studentService.getStudentsWithAttendanceStatistics();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", students
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ==================== ATTENDANCE MANAGEMENT ====================

    // Mark attendance
    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody MarkAttendanceDTO markAttendanceDTO) {
        try {
            User faculty = getCurrentFaculty();
            List<Attendance> attendanceRecords = attendanceService.markAttendance(markAttendanceDTO, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Attendance marked successfully",
                "data", attendanceRecords
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance by event
    @GetMapping("/attendance/event/{eventId}")
    public ResponseEntity<?> getAttendanceByEvent(@PathVariable Long eventId) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByEvent(eventId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", attendance
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance by student
    @GetMapping("/attendance/student/{studentId}")
    public ResponseEntity<?> getAttendanceByStudent(@PathVariable Long studentId) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByStudent(studentId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", attendance
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance by faculty
    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendanceByFaculty(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "markedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            User faculty = getCurrentFaculty();
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Attendance> attendance = attendanceService.getAttendanceByFaculty(faculty.getId(), pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", attendance.getContent(),
                "totalElements", attendance.getTotalElements(),
                "totalPages", attendance.getTotalPages(),
                "currentPage", attendance.getNumber(),
                "size", attendance.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Update attendance
    @PutMapping("/attendance/{attendanceId}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long attendanceId, @Valid @RequestBody MarkAttendanceDTO.AttendanceRecordDTO recordDTO) {
        try {
            User faculty = getCurrentFaculty();
            Attendance attendance = attendanceService.updateAttendance(attendanceId, recordDTO, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Attendance updated successfully",
                "data", attendance
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Delete attendance
    @DeleteMapping("/attendance/{attendanceId}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long attendanceId) {
        try {
            User faculty = getCurrentFaculty();
            attendanceService.deleteAttendance(attendanceId, faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Attendance deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance statistics by event
    @GetMapping("/attendance/event/{eventId}/statistics")
    public ResponseEntity<?> getAttendanceStatisticsByEvent(@PathVariable Long eventId) {
        try {
            AttendanceService.AttendanceStatisticsDTO stats = attendanceService.getAttendanceStatisticsByEvent(eventId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance statistics by student
    @GetMapping("/attendance/student/{studentId}/statistics")
    public ResponseEntity<?> getAttendanceStatisticsByStudent(@PathVariable Long studentId) {
        try {
            AttendanceService.AttendanceStatisticsDTO stats = attendanceService.getAttendanceStatisticsByStudent(studentId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get attendance statistics by faculty
    @GetMapping("/attendance/statistics")
    public ResponseEntity<?> getAttendanceStatisticsByFaculty() {
        try {
            User faculty = getCurrentFaculty();
            AttendanceService.AttendanceStatisticsDTO stats = attendanceService.getAttendanceStatisticsByFaculty(faculty.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ==================== DASHBOARD ====================

    // Get dashboard data
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            User faculty = getCurrentFaculty();
            
            // Get event statistics
            EventService.EventStatisticsDTO eventStats = eventService.getEventStatisticsByFaculty(faculty.getId());
            
            // Get attendance statistics
            AttendanceService.AttendanceStatisticsDTO attendanceStats = attendanceService.getAttendanceStatisticsByFaculty(faculty.getId());
            
            // Get student statistics
            StudentService.StudentStatisticsDTO studentStats = studentService.getStudentStatistics();
            
            // Get upcoming events
            List<EventResponseDTO> upcomingEvents = eventService.getUpcomingEventsByFaculty(faculty.getId());
            
            // Get recent attendance
            List<Attendance> recentAttendance = attendanceService.getRecentAttendance(10);
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("faculty", Map.of(
                "id", faculty.getId(),
                "name", faculty.getName(),
                "email", faculty.getEmail()
            ));
            dashboard.put("eventStatistics", eventStats);
            dashboard.put("attendanceStatistics", attendanceStats);
            dashboard.put("studentStatistics", studentStats);
            dashboard.put("upcomingEvents", upcomingEvents);
            dashboard.put("recentAttendance", recentAttendance);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", dashboard
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ==================== ANALYTICS ENDPOINTS ====================

    // Get all students with attendance analytics
    @GetMapping("/analytics/students")
    public ResponseEntity<?> getStudentAttendanceAnalytics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "attendancePercentage") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String searchTerm) {
        try {
            User faculty = getCurrentFaculty();
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Get all students with attendance statistics
            List<Student> students = studentService.getAllStudentsList();
            List<StudentAttendanceAnalyticsDTO> analytics = new ArrayList<>();
            
            for (Student student : students) {
                // Filter by search term if provided
                if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                    if (!student.getName().toLowerCase().contains(searchTerm.toLowerCase()) &&
                        !student.getEmail().toLowerCase().contains(searchTerm.toLowerCase()) &&
                        !student.getStudentId().toLowerCase().contains(searchTerm.toLowerCase())) {
                        continue;
                    }
                }
                
                StudentAttendanceAnalyticsDTO analyticsDTO = new StudentAttendanceAnalyticsDTO(
                    student.getId(),
                    student.getName(),
                    student.getEmail(),
                    student.getStudentId(),
                    student.getDepartment(),
                    student.getCourse(),
                    student.getAcademicYear().toString(),
                    student.getSemester().toString()
                );
                
                // Get attendance statistics for this student
                List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(student);
                
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
                long excusedCount = attendanceRecords.stream()
                    .filter(a -> a.getStatus() == Attendance.AttendanceStatus.EXCUSED)
                    .count();
                
                analyticsDTO.setTotalEvents(totalEvents);
                analyticsDTO.setPresentCount(presentCount);
                analyticsDTO.setAbsentCount(absentCount);
                analyticsDTO.setLateCount(lateCount);
                analyticsDTO.setExcusedCount(excusedCount);
                
                // Calculate attendance percentage
                analyticsDTO.calculateAttendancePercentage();
                analyticsDTO.determineAttendanceStatus();
                
                // Calculate average marks
                double avgMarks = attendanceRecords.stream()
                    .filter(a -> a.getMarksObtained() != null)
                    .mapToDouble(Attendance::getMarksObtained)
                    .average()
                    .orElse(0.0);
                analyticsDTO.setAverageMarks(avgMarks);
                
                // Get last attendance details
                if (!attendanceRecords.isEmpty()) {
                    Attendance lastAttendance = attendanceRecords.stream()
                        .max(Comparator.comparing(Attendance::getMarkedAt))
                        .orElse(null);
                    
                    if (lastAttendance != null) {
                        analyticsDTO.setLastAttendanceDate(lastAttendance.getMarkedAt());
                        analyticsDTO.setLastAttendanceStatus(lastAttendance.getStatus().toString());
                        analyticsDTO.setLastAttendanceEvent(lastAttendance.getEvent().getTitle());
                    }
                }
                
                analytics.add(analyticsDTO);
            }
            
            // Sort the results
            if (sortBy.equals("attendancePercentage")) {
                analytics.sort((a, b) -> sortDir.equals("desc") ? 
                    Double.compare(b.getAttendancePercentage(), a.getAttendancePercentage()) :
                    Double.compare(a.getAttendancePercentage(), b.getAttendancePercentage()));
            } else if (sortBy.equals("studentName")) {
                analytics.sort((a, b) -> sortDir.equals("desc") ? 
                    b.getStudentName().compareTo(a.getStudentName()) :
                    a.getStudentName().compareTo(b.getStudentName()));
            }
            
            // Apply pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), analytics.size());
            List<StudentAttendanceAnalyticsDTO> paginatedAnalytics = analytics.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedAnalytics);
            response.put("totalElements", analytics.size());
            response.put("totalPages", (int) Math.ceil((double) analytics.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching student analytics: " + e.getMessage()
            ));
        }
    }

    // Get detailed attendance records for a specific student
    @GetMapping("/analytics/students/{studentId}/attendance")
    public ResponseEntity<?> getStudentAttendanceDetails(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "markedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            User faculty = getCurrentFaculty();
            
            // Get student
            Optional<StudentResponseDTO> studentOpt = studentService.getStudentById(studentId);
            if (studentOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Student not found"
                ));
            }
            
            // Get the actual Student entity
            Student student = studentService.getStudentEntityById(studentId);
            
            // Get attendance records
            List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(student);
            
            List<StudentAttendanceDetailDTO> details = attendanceRecords.stream()
                .map(attendance -> {
                    StudentAttendanceDetailDTO detail = new StudentAttendanceDetailDTO();
                    detail.setAttendanceId(attendance.getId());
                    detail.setEventId(attendance.getEvent().getId());
                    detail.setEventTitle(attendance.getEvent().getTitle());
                    detail.setEventType(attendance.getEvent().getEventType().toString());
                    detail.setEventDate(attendance.getEvent().getStartTime());
                    detail.setEventLocation(attendance.getEvent().getLocation());
                    detail.setAttendanceStatus(attendance.getStatus().toString());
                    detail.setMarksObtained(attendance.getMarksObtained());
                    detail.setMaxMarks(attendance.getMaxMarks());
                    detail.setRemarks(attendance.getRemarks());
                    detail.setMarkedAt(attendance.getMarkedAt());
                    detail.setMarkedByFaculty(attendance.getMarkedByFaculty().getName());
                    return detail;
                })
                .sorted((a, b) -> {
                    if (sortBy.equals("markedAt")) {
                        return sortDir.equals("desc") ? 
                            b.getMarkedAt().compareTo(a.getMarkedAt()) :
                            a.getMarkedAt().compareTo(b.getMarkedAt());
                    } else if (sortBy.equals("eventDate")) {
                        return sortDir.equals("desc") ? 
                            b.getEventDate().compareTo(a.getEventDate()) :
                            a.getEventDate().compareTo(b.getEventDate());
                    }
                    return 0;
                })
                .collect(Collectors.toList());
            
            // Apply pagination
            int start = (int) (page * size);
            int end = Math.min(start + size, details.size());
            List<StudentAttendanceDetailDTO> paginatedDetails = details.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedDetails);
            response.put("totalElements", details.size());
            response.put("totalPages", (int) Math.ceil((double) details.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching student attendance details: " + e.getMessage()
            ));
        }
    }

    // Get analytics summary for faculty
    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        try {
            // Get all students
            List<Student> students = studentService.getAllStudentsList();
            
            // Calculate overall statistics
            long totalStudents = students.size();
            long studentsWithAttendance = 0;
            double totalAttendanceRate = 0.0;
            double totalAverageMarks = 0.0;
            
            Map<String, Long> attendanceStatusCount = new HashMap<>();
            attendanceStatusCount.put("Excellent", 0L);
            attendanceStatusCount.put("Good", 0L);
            attendanceStatusCount.put("Average", 0L);
            attendanceStatusCount.put("Poor", 0L);
            
            for (Student student : students) {
                List<Attendance> attendanceRecords = attendanceService.getAttendanceByStudent(student);
                
                if (!attendanceRecords.isEmpty()) {
                    studentsWithAttendance++;
                    
                    long presentCount = attendanceRecords.stream()
                        .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                        .count();
                    long lateCount = attendanceRecords.stream()
                        .filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE)
                        .count();
                    
                    double studentAttendanceRate = ((double) (presentCount + lateCount) / attendanceRecords.size()) * 100;
                    totalAttendanceRate += studentAttendanceRate;
                    
                    // Determine attendance status
                    if (studentAttendanceRate >= 90) {
                        attendanceStatusCount.put("Excellent", attendanceStatusCount.get("Excellent") + 1);
                    } else if (studentAttendanceRate >= 80) {
                        attendanceStatusCount.put("Good", attendanceStatusCount.get("Good") + 1);
                    } else if (studentAttendanceRate >= 70) {
                        attendanceStatusCount.put("Average", attendanceStatusCount.get("Average") + 1);
                    } else {
                        attendanceStatusCount.put("Poor", attendanceStatusCount.get("Poor") + 1);
                    }
                    
                    // Calculate average marks
                    double studentAvgMarks = attendanceRecords.stream()
                        .filter(a -> a.getMarksObtained() != null)
                        .mapToDouble(Attendance::getMarksObtained)
                        .average()
                        .orElse(0.0);
                    totalAverageMarks += studentAvgMarks;
                }
            }
            
            double overallAttendanceRate = studentsWithAttendance > 0 ? totalAttendanceRate / studentsWithAttendance : 0.0;
            double overallAverageMarks = studentsWithAttendance > 0 ? totalAverageMarks / studentsWithAttendance : 0.0;
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalStudents", totalStudents);
            summary.put("studentsWithAttendance", studentsWithAttendance);
            summary.put("overallAttendanceRate", String.format("%.2f", overallAttendanceRate));
            summary.put("overallAverageMarks", String.format("%.2f", overallAverageMarks));
            summary.put("attendanceStatusDistribution", attendanceStatusCount);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", summary
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error fetching analytics summary: " + e.getMessage()
            ));
        }
    }
}