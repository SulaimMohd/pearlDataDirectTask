package com.pearldata.service;

import com.pearldata.dto.MarkAttendanceDTO;
import com.pearldata.dto.MarkAttendanceAndUpdateEventDTO;
import com.pearldata.dto.AttendanceMarkingResponseDTO;
import com.pearldata.entity.Attendance;
import com.pearldata.entity.Event;
import com.pearldata.entity.Student;
import com.pearldata.entity.User;
import com.pearldata.repository.AttendanceRepository;
import com.pearldata.repository.EventRepository;
import com.pearldata.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserService userService;

    // Mark attendance for multiple students
    public List<Attendance> markAttendance(MarkAttendanceDTO markAttendanceDTO, Long facultyId) {
        // Validate faculty
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        if (faculty.getRole() != User.Role.FACULTY) {
            throw new RuntimeException("User is not a faculty member");
        }

        // Get event
        Event event = eventRepository.findById(markAttendanceDTO.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if faculty owns this event
        if (!event.getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to mark attendance for this event");
        }

        // Check if event is in the past
        if (event.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot mark attendance for past events");
        }

        // Mark attendance for each student
        List<Attendance> attendanceRecords = markAttendanceDTO.getAttendanceRecords().stream()
                .map(recordDTO -> {
                    // Get student
                    Student student = studentRepository.findById(recordDTO.getStudentId())
                            .orElseThrow(() -> new RuntimeException("Student not found: " + recordDTO.getStudentId()));

                    // Validate marks if provided
                    if (recordDTO.getMarksObtained() != null && recordDTO.getMaxMarks() != null) {
                        if (!recordDTO.hasValidMarks()) {
                            throw new RuntimeException("Invalid marks for student " + student.getName());
                        }
                    }

                    // Check if attendance already exists
                    Optional<Attendance> existingAttendance = attendanceRepository.findByStudentAndEvent(student, event);
                    
                    if (existingAttendance.isPresent()) {
                        // Update existing attendance
                        Attendance attendance = existingAttendance.get();
                        attendance.setStatus(recordDTO.getStatus());
                        attendance.setMarksObtained(recordDTO.getMarksObtained());
                        attendance.setMaxMarks(recordDTO.getMaxMarks());
                        attendance.setRemarks(recordDTO.getRemarks());
                        attendance.setMarkedByFaculty(faculty);
                        return attendanceRepository.save(attendance);
                    } else {
                        // Create new attendance
                        Attendance attendance = new Attendance();
                        attendance.setStudent(student);
                        attendance.setEvent(event);
                        attendance.setStatus(recordDTO.getStatus());
                        attendance.setMarksObtained(recordDTO.getMarksObtained());
                        attendance.setMaxMarks(recordDTO.getMaxMarks());
                        attendance.setRemarks(recordDTO.getRemarks());
                        attendance.setMarkedByFaculty(faculty);
                        return attendanceRepository.save(attendance);
                    }
                })
                .collect(Collectors.toList());

        return attendanceRecords;
    }

    // Enhanced method: Mark attendance and optionally update event status
    public AttendanceMarkingResponseDTO markAttendanceAndUpdateEvent(MarkAttendanceAndUpdateEventDTO dto, Long facultyId) {
        // Validate faculty
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        if (faculty.getRole() != User.Role.FACULTY) {
            throw new RuntimeException("User is not a faculty member");
        }

        // Get event
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if faculty owns this event
        if (!event.getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to mark attendance for this event");
        }

        // Validate event status
        if (event.getStatus() == Event.EventStatus.CANCELLED) {
            throw new RuntimeException("Cannot mark attendance for cancelled events");
        }

        Event.EventStatus previousEventStatus = event.getStatus();
        Event.EventStatus newEventStatus = previousEventStatus;
        boolean eventStatusChanged = false;

        // Process attendance records
        List<Attendance> attendanceRecords = dto.getAttendanceRecords().stream()
                .map(recordDTO -> {
                    // Validate student
                    Student student = studentRepository.findById(recordDTO.getStudentId())
                            .orElseThrow(() -> new RuntimeException("Student not found: " + recordDTO.getStudentId()));

                    // Check for existing attendance
                    Optional<Attendance> existingAttendance = attendanceRepository
                            .findByStudentAndEvent(student, event);
                    
                    if (existingAttendance.isPresent()) {
                        // Update existing attendance
                        Attendance attendance = existingAttendance.get();
                        attendance.setStatus(recordDTO.getStatus());
                        attendance.setMarksObtained(recordDTO.getMarksObtained());
                        attendance.setMaxMarks(recordDTO.getMaxMarks());
                        attendance.setRemarks(recordDTO.getRemarks());
                        attendance.setMarkedByFaculty(faculty);
                        return attendanceRepository.save(attendance);
                    } else {
                        // Create new attendance
                        Attendance attendance = new Attendance();
                        attendance.setStudent(student);
                        attendance.setEvent(event);
                        attendance.setStatus(recordDTO.getStatus());
                        attendance.setMarksObtained(recordDTO.getMarksObtained());
                        attendance.setMaxMarks(recordDTO.getMaxMarks());
                        attendance.setRemarks(recordDTO.getRemarks());
                        attendance.setMarkedByFaculty(faculty);
                        return attendanceRepository.save(attendance);
                    }
                })
                .collect(Collectors.toList());

        // Update event status if requested
        if (dto.getMarkEventAsCompleted() != null && dto.getMarkEventAsCompleted()) {
            // Check if attendance has been marked before for this event
            boolean hasExistingAttendance = attendanceRepository.existsByEvent(event);
            
            if (event.getStatus() == Event.EventStatus.SCHEDULED) {
                if (hasExistingAttendance) {
                    // If attendance was already marked before, directly mark as COMPLETED
                    newEventStatus = Event.EventStatus.COMPLETED;
                } else {
                    // First time marking attendance, mark as ONGOING
                    newEventStatus = Event.EventStatus.ONGOING;
                }
                event.setStatus(newEventStatus);
                event.setUpdatedAt(LocalDateTime.now());
                eventRepository.save(event);
                eventStatusChanged = true;
            } else if (event.getStatus() == Event.EventStatus.ONGOING) {
                // Always mark as COMPLETED when status is ONGOING
                newEventStatus = Event.EventStatus.COMPLETED;
                event.setStatus(newEventStatus);
                event.setUpdatedAt(LocalDateTime.now());
                eventRepository.save(event);
                eventStatusChanged = true;
            }
        }

        // Calculate attendance summary
        int totalStudents = attendanceRecords.size();
        int presentCount = (int) attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
        int absentCount = (int) attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                .count();
        int lateCount = (int) attendanceRecords.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE)
                .count();
        
        double attendancePercentage = totalStudents > 0 ? 
                ((double) (presentCount + lateCount) / totalStudents) * 100 : 0;

        // Calculate average marks
        double averageMarks = attendanceRecords.stream()
                .filter(a -> a.getMarksObtained() != null)
                .mapToDouble(Attendance::getMarksObtained)
                .average()
                .orElse(0.0);

        // Create response DTOs
        AttendanceMarkingResponseDTO.AttendanceSummary attendanceSummary = 
                new AttendanceMarkingResponseDTO.AttendanceSummary(
                        totalStudents, presentCount, absentCount, lateCount, 
                        attendancePercentage, averageMarks);

        AttendanceMarkingResponseDTO.EventSummary eventSummary = 
                new AttendanceMarkingResponseDTO.EventSummary(
                        event.getId(), event.getTitle(), previousEventStatus, 
                        newEventStatus, eventStatusChanged, LocalDateTime.now());

        List<AttendanceMarkingResponseDTO.AttendanceRecord> responseRecords = 
                attendanceRecords.stream()
                        .map(a -> new AttendanceMarkingResponseDTO.AttendanceRecord(
                                a.getStudent().getId(),
                                a.getStudent().getName(),
                                a.getStatus(),
                                a.getMarksObtained(),
                                a.getMaxMarks(),
                                a.getMaxMarks() != null && a.getMarksObtained() != null && a.getMaxMarks() > 0 ?
                                        (a.getMarksObtained() / a.getMaxMarks()) * 100 : null,
                                a.getRemarks()
                        ))
                        .collect(Collectors.toList());

        String message = "Attendance marked successfully";
        if (eventStatusChanged) {
            message += " and event status updated to " + newEventStatus;
        }

        return new AttendanceMarkingResponseDTO(true, message, attendanceSummary, eventSummary, responseRecords);
    }

    // Get attendance by ID
    @Transactional(readOnly = true)
    public Optional<Attendance> getAttendanceById(Long attendanceId) {
        return attendanceRepository.findById(attendanceId);
    }

    // Get attendance by ID with details
    @Transactional(readOnly = true)
    public Optional<Attendance> getAttendanceByIdWithDetails(Long attendanceId) {
        return attendanceRepository.findByIdWithDetails(attendanceId);
    }

    // Get attendance by student
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        return attendanceRepository.findByStudentWithEventDetails(student);
    }

    // Get attendance by student object
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStudent(Student student) {
        return attendanceRepository.findByStudentWithEventDetails(student);
    }

    // Get attendance by student with pagination
    @Transactional(readOnly = true)
    public Page<Attendance> getAttendanceByStudent(Long studentId, Pageable pageable) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        return attendanceRepository.findByStudent(student, pageable);
    }

    // Get attendance by event
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        return attendanceRepository.findByEventWithStudentDetails(event);
    }

    // Get attendance by event with pagination
    @Transactional(readOnly = true)
    public Page<Attendance> getAttendanceByEvent(Long eventId, Pageable pageable) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        return attendanceRepository.findByEvent(event, pageable);
    }

    // Get attendance by faculty
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return attendanceRepository.findByFacultyWithDetails(faculty);
    }

    // Get attendance by faculty with pagination
    @Transactional(readOnly = true)
    public Page<Attendance> getAttendanceByFaculty(Long facultyId, Pageable pageable) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return attendanceRepository.findByMarkedByFaculty(faculty, pageable);
    }

    // Get attendance by status
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStatus(Attendance.AttendanceStatus status) {
        return attendanceRepository.findByStatusWithDetails(status);
    }

    // Get attendance between dates
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return attendanceRepository.findAttendanceBetweenDates(startDate, endDate);
    }

    // Get attendance by student between dates
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStudentBetweenDates(Long studentId, LocalDateTime startDate, LocalDateTime endDate) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        return attendanceRepository.findAttendanceByStudentBetweenDates(student, startDate, endDate);
    }

    // Get attendance by faculty between dates
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByFacultyBetweenDates(Long facultyId, LocalDateTime startDate, LocalDateTime endDate) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return attendanceRepository.findAttendanceByFacultyBetweenDates(faculty, startDate, endDate);
    }

    // Get attendance statistics for student
    @Transactional(readOnly = true)
    public AttendanceStatisticsDTO getAttendanceStatisticsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        long totalAttendance = attendanceRepository.countByStudent(student);
        long presentCount = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.PRESENT);
        long absentCount = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.ABSENT);
        long lateCount = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.LATE);
        long excusedCount = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.EXCUSED);

        double attendancePercentage = totalAttendance > 0 ? (double) presentCount / totalAttendance * 100 : 0.0;

        return new AttendanceStatisticsDTO(totalAttendance, presentCount, absentCount, lateCount, excusedCount, attendancePercentage);
    }

    // Get attendance statistics for event
    @Transactional(readOnly = true)
    public AttendanceStatisticsDTO getAttendanceStatisticsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        long totalAttendance = attendanceRepository.countByEvent(event);
        long presentCount = attendanceRepository.countByEventAndStatus(event, Attendance.AttendanceStatus.PRESENT);
        long absentCount = attendanceRepository.countByEventAndStatus(event, Attendance.AttendanceStatus.ABSENT);
        long lateCount = attendanceRepository.countByEventAndStatus(event, Attendance.AttendanceStatus.LATE);
        long excusedCount = attendanceRepository.countByEventAndStatus(event, Attendance.AttendanceStatus.EXCUSED);

        double attendancePercentage = totalAttendance > 0 ? (double) presentCount / totalAttendance * 100 : 0.0;

        return new AttendanceStatisticsDTO(totalAttendance, presentCount, absentCount, lateCount, excusedCount, attendancePercentage);
    }

    // Get attendance statistics for faculty
    @Transactional(readOnly = true)
    public AttendanceStatisticsDTO getAttendanceStatisticsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        long totalAttendance = attendanceRepository.countByMarkedByFaculty(faculty);
        long presentCount = attendanceRepository.findByMarkedByFaculty(faculty, Pageable.unpaged())
                .stream()
                .mapToLong(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.PRESENT ? 1 : 0)
                .sum();
        long absentCount = attendanceRepository.findByMarkedByFaculty(faculty, Pageable.unpaged())
                .stream()
                .mapToLong(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.ABSENT ? 1 : 0)
                .sum();
        long lateCount = attendanceRepository.findByMarkedByFaculty(faculty, Pageable.unpaged())
                .stream()
                .mapToLong(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.LATE ? 1 : 0)
                .sum();
        long excusedCount = attendanceRepository.findByMarkedByFaculty(faculty, Pageable.unpaged())
                .stream()
                .mapToLong(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.EXCUSED ? 1 : 0)
                .sum();

        double attendancePercentage = totalAttendance > 0 ? (double) presentCount / totalAttendance * 100 : 0.0;

        return new AttendanceStatisticsDTO(totalAttendance, presentCount, absentCount, lateCount, excusedCount, attendancePercentage);
    }

    // Update attendance
    public Attendance updateAttendance(Long attendanceId, MarkAttendanceDTO.AttendanceRecordDTO recordDTO, Long facultyId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        // Check if faculty owns this attendance record
        if (!attendance.getMarkedByFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to update this attendance record");
        }

        // Validate marks if provided
        if (recordDTO.getMarksObtained() != null && recordDTO.getMaxMarks() != null) {
            if (!recordDTO.hasValidMarks()) {
                throw new RuntimeException("Invalid marks");
            }
        }

        // Update fields
        attendance.setStatus(recordDTO.getStatus());
        attendance.setMarksObtained(recordDTO.getMarksObtained());
        attendance.setMaxMarks(recordDTO.getMaxMarks());
        attendance.setRemarks(recordDTO.getRemarks());

        return attendanceRepository.save(attendance);
    }

    // Delete attendance
    public void deleteAttendance(Long attendanceId, Long facultyId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        // Check if faculty owns this attendance record
        if (!attendance.getMarkedByFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to delete this attendance record");
        }

        // Check if attendance is recent (within 24 hours)
        if (attendance.getMarkedAt().isBefore(LocalDateTime.now().minusHours(24))) {
            throw new RuntimeException("Cannot delete attendance records older than 24 hours");
        }

        attendanceRepository.delete(attendance);
    }

    // Get recent attendance
    @Transactional(readOnly = true)
    public List<Attendance> getRecentAttendance(int limit) {
        return attendanceRepository.findRecentAttendance(Pageable.ofSize(limit));
    }

    // Get attendance with marks
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceWithMarks() {
        return attendanceRepository.findAttendanceWithMarks();
    }

    // Get attendance with marks by student
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceWithMarksByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        return attendanceRepository.findAttendanceWithMarksByStudent(student);
    }

    // Get attendance with marks by event
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceWithMarksByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        return attendanceRepository.findAttendanceWithMarksByEvent(event);
    }

    // Calculate average marks by student
    @Transactional(readOnly = true)
    public Double getAverageMarksByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        return attendanceRepository.findAverageMarksByStudent(student);
    }

    // Calculate average marks by event
    @Transactional(readOnly = true)
    public Double getAverageMarksByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        return attendanceRepository.findAverageMarksByEvent(event);
    }

    // Get average attendance rate by faculty
    @Transactional(readOnly = true)
    public double getAverageAttendanceRateByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        // Get all events by this faculty
        List<Event> facultyEvents = eventRepository.findByFaculty(faculty);
        
        if (facultyEvents.isEmpty()) {
            return 0.0;
        }
        
        // Calculate average attendance rate across all events
        double totalAttendanceRate = 0.0;
        int eventsWithAttendance = 0;
        
        for (Event event : facultyEvents) {
            List<Attendance> attendanceRecords = attendanceRepository.findByEvent(event);
            if (!attendanceRecords.isEmpty()) {
                long presentCount = attendanceRecords.stream()
                        .filter(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.PRESENT)
                        .count();
                double attendanceRate = (double) presentCount / attendanceRecords.size() * 100;
                totalAttendanceRate += attendanceRate;
                eventsWithAttendance++;
            }
        }
        
        return eventsWithAttendance > 0 ? totalAttendanceRate / eventsWithAttendance : 0.0;
    }

    // Inner class for statistics
    public static class AttendanceStatisticsDTO {
        private long totalAttendance;
        private long presentCount;
        private long absentCount;
        private long lateCount;
        private long excusedCount;
        private double attendancePercentage;

        public AttendanceStatisticsDTO(long totalAttendance, long presentCount, long absentCount, 
                                     long lateCount, long excusedCount, double attendancePercentage) {
            this.totalAttendance = totalAttendance;
            this.presentCount = presentCount;
            this.absentCount = absentCount;
            this.lateCount = lateCount;
            this.excusedCount = excusedCount;
            this.attendancePercentage = attendancePercentage;
        }

        // Getters
        public long getTotalAttendance() { return totalAttendance; }
        public long getPresentCount() { return presentCount; }
        public long getAbsentCount() { return absentCount; }
        public long getLateCount() { return lateCount; }
        public long getExcusedCount() { return excusedCount; }
        public double getAttendancePercentage() { return attendancePercentage; }
    }
}
