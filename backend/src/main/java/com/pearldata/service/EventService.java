package com.pearldata.service;

import com.pearldata.dto.CreateEventDTO;
import com.pearldata.dto.EventResponseDTO;
import com.pearldata.dto.UpdateEventDTO;
import com.pearldata.entity.Event;
import com.pearldata.entity.Student;
import com.pearldata.entity.User;
import com.pearldata.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private SmsService smsService;

    // Create event
    public EventResponseDTO createEvent(CreateEventDTO createEventDTO, Long facultyId) {
        // Validate faculty
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        if (faculty.getRole() != User.Role.FACULTY) {
            throw new RuntimeException("User is not a faculty member");
        }

        // Validate time range
        if (!createEventDTO.isValidTimeRange()) {
            throw new RuntimeException("Invalid time range: end time must be after start time");
        }

        // Check for duplicate events
        if (eventRepository.existsByFacultyAndTitleAndStartTime(faculty, createEventDTO.getTitle(), createEventDTO.getStartTime())) {
            throw new RuntimeException("An event with the same title and start time already exists");
        }

        // Create event
        Event event = new Event();
        event.setTitle(createEventDTO.getTitle());
        event.setDescription(createEventDTO.getDescription());
        event.setEventType(createEventDTO.getEventType());
        event.setStartTime(createEventDTO.getStartTime());
        event.setEndTime(createEventDTO.getEndTime());
        event.setLocation(createEventDTO.getLocation());
        event.setFaculty(faculty);
        event.setStatus(Event.EventStatus.SCHEDULED);

        Event savedEvent = eventRepository.save(event);
        
        // Send SMS notifications to all students asynchronously
        sendEventNotificationsToStudents(savedEvent);
        
        return new EventResponseDTO(savedEvent);
    }

    // Get event by ID
    @Transactional(readOnly = true)
    public Optional<EventResponseDTO> getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .map(EventResponseDTO::new);
    }

    // Get event by ID with attendance
    @Transactional(readOnly = true)
    public Optional<EventResponseDTO> getEventByIdWithAttendance(Long eventId) {
        return eventRepository.findByIdWithAttendance(eventId)
                .map(event -> {
                    EventResponseDTO dto = new EventResponseDTO(event);
                    // Add attendance statistics
                    if (event.getAttendanceRecords() != null) {
                        long totalRecords = event.getAttendanceRecords().size();
                        long presentCount = event.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.getStatus() == com.pearldata.entity.Attendance.AttendanceStatus.PRESENT ? 1 : 0)
                                .sum();
                        long absentCount = event.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.getStatus() == com.pearldata.entity.Attendance.AttendanceStatus.ABSENT ? 1 : 0)
                                .sum();
                        
                        dto.setTotalAttendanceRecords(totalRecords);
                        dto.setPresentCount(presentCount);
                        dto.setAbsentCount(absentCount);
                        dto.setAttendancePercentage(totalRecords > 0 ? (double) presentCount / totalRecords * 100 : 0.0);
                    }
                    return dto;
                });
    }

    // Get events by faculty
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findByFacultyWithAttendance(faculty)
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get events by faculty with pagination
    @Transactional(readOnly = true)
    public Page<EventResponseDTO> getEventsByFaculty(Long facultyId, Pageable pageable) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findByFaculty(faculty, pageable)
                .map(EventResponseDTO::new);
    }

    // Get events by faculty and status
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getEventsByFacultyAndStatus(Long facultyId, Event.EventStatus status) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findByFacultyAndStatus(faculty, status)
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get upcoming events by faculty
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getUpcomingEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findUpcomingEventsByFaculty(faculty, LocalDateTime.now())
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get current events by faculty
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getCurrentEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findCurrentEventsByFaculty(faculty, LocalDateTime.now())
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get completed events by faculty
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getCompletedEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.findCompletedEventsByFaculty(faculty, LocalDateTime.now())
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Search events by faculty
    @Transactional(readOnly = true)
    public List<EventResponseDTO> searchEventsByFaculty(Long facultyId, String searchTerm) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        return eventRepository.searchEventsByFaculty(faculty, searchTerm)
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Update event
    public EventResponseDTO updateEvent(Long eventId, UpdateEventDTO updateEventDTO, Long facultyId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if faculty owns this event
        if (!event.getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to update this event");
        }

        // Validate time range if provided
        if (updateEventDTO.hasTimeRange() && !updateEventDTO.hasValidTimeRange()) {
            throw new RuntimeException("Invalid time range: end time must be after start time");
        }

        // Update fields
        if (updateEventDTO.getTitle() != null) {
            event.setTitle(updateEventDTO.getTitle());
        }
        if (updateEventDTO.getDescription() != null) {
            event.setDescription(updateEventDTO.getDescription());
        }
        if (updateEventDTO.getEventType() != null) {
            event.setEventType(updateEventDTO.getEventType());
        }
        if (updateEventDTO.getStartTime() != null) {
            event.setStartTime(updateEventDTO.getStartTime());
        }
        if (updateEventDTO.getEndTime() != null) {
            event.setEndTime(updateEventDTO.getEndTime());
        }
        if (updateEventDTO.getLocation() != null) {
            event.setLocation(updateEventDTO.getLocation());
        }
        if (updateEventDTO.getStatus() != null) {
            event.setStatus(updateEventDTO.getStatus());
        }

        Event updatedEvent = eventRepository.save(event);
        return new EventResponseDTO(updatedEvent);
    }

    // Update event status
    public EventResponseDTO updateEventStatus(Long eventId, Event.EventStatus newStatus, Long facultyId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if faculty owns this event
        if (!event.getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to update this event");
        }

        // Validate status transition
        if (!isValidStatusTransition(event.getStatus(), newStatus)) {
            throw new RuntimeException("Invalid status transition from " + event.getStatus() + " to " + newStatus);
        }

        Event.EventStatus previousStatus = event.getStatus();
        event.setStatus(newStatus);
        event.setUpdatedAt(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);
        
        // Log the status change
        System.out.println("Event " + eventId + " status changed from " + previousStatus + " to " + newStatus + " by faculty " + facultyId);
        
        return new EventResponseDTO(savedEvent);
    }

    // Validate status transitions
    private boolean isValidStatusTransition(Event.EventStatus current, Event.EventStatus newStatus) {
        switch (current) {
            case SCHEDULED:
                return newStatus == Event.EventStatus.ONGOING || newStatus == Event.EventStatus.CANCELLED;
            case ONGOING:
                return newStatus == Event.EventStatus.COMPLETED || newStatus == Event.EventStatus.CANCELLED;
            case COMPLETED:
            case CANCELLED:
                return false; // Cannot change from completed or cancelled
            default:
                return false;
        }
    }

    // Delete event
    public void deleteEvent(Long eventId, Long facultyId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if faculty owns this event
        if (!event.getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("You don't have permission to delete this event");
        }

        // Check if event can be deleted (no attendance records or future event)
        if (event.getAttendanceRecords() != null && !event.getAttendanceRecords().isEmpty()) {
            throw new RuntimeException("Cannot delete event with attendance records");
        }

        if (event.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot delete past events");
        }

        eventRepository.delete(event);
    }

    // Get all events (admin only)
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get events by status (admin only)
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getEventsByStatus(Event.EventStatus status) {
        return eventRepository.findByStatus(status)
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get events between dates (admin only)
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsBetweenDates(startDate, endDate)
                .stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Count events by faculty
    @Transactional(readOnly = true)
    public long countEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return eventRepository.countByFaculty(faculty);
    }

    // Count upcoming events by faculty
    @Transactional(readOnly = true)
    public long countUpcomingEventsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return eventRepository.countByFacultyAndStatus(faculty, Event.EventStatus.SCHEDULED);
    }

    // Get event statistics by faculty
    @Transactional(readOnly = true)
    public EventStatisticsDTO getEventStatisticsByFaculty(Long facultyId) {
        User faculty = userService.getUserById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        long totalEvents = eventRepository.countByFaculty(faculty);
        long scheduledEvents = eventRepository.countByFacultyAndStatus(faculty, Event.EventStatus.SCHEDULED);
        long completedEvents = eventRepository.countByFacultyAndStatus(faculty, Event.EventStatus.COMPLETED);
        long cancelledEvents = eventRepository.countByFacultyAndStatus(faculty, Event.EventStatus.CANCELLED);

        return new EventStatisticsDTO(totalEvents, scheduledEvents, completedEvents, cancelledEvents);
    }

    // Count upcoming events
    @Transactional(readOnly = true)
    public long countUpcomingEvents() {
        return eventRepository.countByStartTimeAfter(LocalDateTime.now());
    }

    // Get upcoming events (for students)
    @Transactional(readOnly = true)
    public Page<Event> getUpcomingEvents(Pageable pageable) {
        return eventRepository.findByStartTimeAfter(LocalDateTime.now(), pageable);
    }

    // Inner class for statistics
    public static class EventStatisticsDTO {
        private long totalEvents;
        private long scheduledEvents;
        private long completedEvents;
        private long cancelledEvents;

        public EventStatisticsDTO(long totalEvents, long scheduledEvents, long completedEvents, long cancelledEvents) {
            this.totalEvents = totalEvents;
            this.scheduledEvents = scheduledEvents;
            this.completedEvents = completedEvents;
            this.cancelledEvents = cancelledEvents;
        }

        // Getters
        public long getTotalEvents() { return totalEvents; }
        public long getScheduledEvents() { return scheduledEvents; }
        public long getCompletedEvents() { return completedEvents; }
        public long getCancelledEvents() { return cancelledEvents; }
    }

    /**
     * Send SMS notifications to all students when a new event is created
     */
    private void sendEventNotificationsToStudents(Event event) {
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("Starting SMS notifications for new event: {}", event.getTitle());
                
                List<Student> students = studentService.getAllStudentsList();
                logger.info("Found {} students to notify", students.size());
                
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                
                String eventDate = event.getStartTime().format(dateFormatter);
                String eventTime = event.getStartTime().format(timeFormatter);
                
                int successCount = 0;
                int failureCount = 0;
                
                for (Student student : students) {
                    try {
                        // Validate phone number
                        if (smsService.isValidIndianPhoneNumber(student.getPhoneNumber())) {
                            String formattedPhone = smsService.formatPhoneNumber(student.getPhoneNumber());
                            
                            boolean sent = smsService.sendEventNotification(
                                student.getName(),
                                formattedPhone,
                                event.getTitle(),
                                eventDate,
                                eventTime
                            );
                            
                            if (sent) {
                                successCount++;
                                logger.debug("SMS sent successfully to student: {}", student.getName());
                            } else {
                                failureCount++;
                                logger.warn("Failed to send SMS to student: {}", student.getName());
                            }
                        } else {
                            failureCount++;
                            logger.warn("Invalid phone number for student: {} - {}", student.getName(), student.getPhoneNumber());
                        }
                        
                        // Add small delay to avoid rate limiting
                        Thread.sleep(200);
                        
                    } catch (Exception e) {
                        failureCount++;
                        logger.error("Error sending SMS to student {}: {}", student.getName(), e.getMessage());
                    }
                }
                
                logger.info("SMS notification completed for event '{}'. Success: {}, Failed: {}", 
                    event.getTitle(), successCount, failureCount);
                
            } catch (Exception e) {
                logger.error("Error in sendEventNotificationsToStudents: {}", e.getMessage(), e);
            }
        });
    }
}
