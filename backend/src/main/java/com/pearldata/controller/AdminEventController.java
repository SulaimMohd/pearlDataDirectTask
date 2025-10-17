package com.pearldata.controller;

import com.pearldata.dto.*;
import com.pearldata.entity.Event;
import com.pearldata.entity.User;
import com.pearldata.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private AttendanceService attendanceService;

    // Get all events
    @GetMapping
    public ResponseEntity<?> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            // For admin, we'll get all events from all faculties
            List<EventResponseDTO> events = eventService.getAllEvents();
            
            // Manual pagination since we don't have a paginated method for all events
            int start = page * size;
            int end = Math.min(start + size, events.size());
            List<EventResponseDTO> paginatedEvents = events.subList(start, end);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", paginatedEvents,
                "totalElements", events.size(),
                "totalPages", (int) Math.ceil((double) events.size() / size),
                "currentPage", page,
                "size", size
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get event by ID
    @GetMapping("/{eventId}")
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

    // Get events by status
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getEventsByStatus(@PathVariable Event.EventStatus status) {
        try {
            List<EventResponseDTO> events = eventService.getEventsByStatus(status);
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

    // Get events by faculty
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<?> getEventsByFaculty(@PathVariable Long facultyId) {
        try {
            List<EventResponseDTO> events = eventService.getEventsByFaculty(facultyId);
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

    // Get events between dates
    @GetMapping("/between")
    public ResponseEntity<?> getEventsBetweenDates(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            
            List<EventResponseDTO> events = eventService.getEventsBetweenDates(start, end);
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

    // Create event for specific faculty (admin can create events for any faculty)
    @PostMapping("/faculty/{facultyId}")
    public ResponseEntity<?> createEventForFaculty(@PathVariable Long facultyId, @Valid @RequestBody CreateEventDTO createEventDTO) {
        try {
            EventResponseDTO event = eventService.createEvent(createEventDTO, facultyId);
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

    // Update any event (admin can update any event)
    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @Valid @RequestBody UpdateEventDTO updateEventDTO) {
        try {
            // Get the event to find the faculty
            Optional<EventResponseDTO> eventOpt = eventService.getEventById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // For admin, we'll get the faculty ID from the event and update it
            EventResponseDTO event = eventOpt.get();
            EventResponseDTO updatedEvent = eventService.updateEvent(eventId, updateEventDTO, event.getFacultyId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event updated successfully",
                "data", updatedEvent
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Delete any event (admin can delete any event)
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        try {
            // Get the event to find the faculty
            Optional<EventResponseDTO> eventOpt = eventService.getEventById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventResponseDTO event = eventOpt.get();
            eventService.deleteEvent(eventId, event.getFacultyId());
            
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

    // Get event statistics (all events)
    @GetMapping("/statistics")
    public ResponseEntity<?> getAllEventStatistics() {
        try {
            // Get all events and calculate statistics
            List<EventResponseDTO> allEvents = eventService.getAllEvents();
            
            long totalEvents = allEvents.size();
            long scheduledEvents = allEvents.stream()
                    .mapToLong(e -> e.getStatus() == Event.EventStatus.SCHEDULED ? 1 : 0)
                    .sum();
            long completedEvents = allEvents.stream()
                    .mapToLong(e -> e.getStatus() == Event.EventStatus.COMPLETED ? 1 : 0)
                    .sum();
            long cancelledEvents = allEvents.stream()
                    .mapToLong(e -> e.getStatus() == Event.EventStatus.CANCELLED ? 1 : 0)
                    .sum();
            
            Map<String, Object> stats = Map.of(
                "totalEvents", totalEvents,
                "scheduledEvents", scheduledEvents,
                "completedEvents", completedEvents,
                "cancelledEvents", cancelledEvents
            );
            
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

    // Get attendance statistics for an event
    @GetMapping("/{eventId}/attendance-statistics")
    public ResponseEntity<?> getEventAttendanceStatistics(@PathVariable Long eventId) {
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
}
