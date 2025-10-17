package com.pearldata.repository;

import com.pearldata.entity.Event;
import com.pearldata.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events by faculty
    List<Event> findByFaculty(User faculty);
    
    // Find events by faculty with pagination
    Page<Event> findByFaculty(User faculty, Pageable pageable);
    
    // Find events by faculty and status
    List<Event> findByFacultyAndStatus(User faculty, Event.EventStatus status);
    
    // Find events by status
    List<Event> findByStatus(Event.EventStatus status);
    
    // Count upcoming events
    long countByStartTimeAfter(LocalDateTime startTime);
    
    // Find upcoming events
    Page<Event> findByStartTimeAfter(LocalDateTime startTime, Pageable pageable);
    
    // Find events by event type
    List<Event> findByEventType(Event.EventType eventType);
    
    // Find events between date range
    @Query("SELECT e FROM Event e WHERE e.startTime BETWEEN :startDate AND :endDate ORDER BY e.startTime")
    List<Event> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Find events by faculty between date range
    @Query("SELECT e FROM Event e WHERE e.faculty = :faculty AND e.startTime BETWEEN :startDate AND :endDate ORDER BY e.startTime")
    List<Event> findEventsByFacultyBetweenDates(@Param("faculty") User faculty,
                                                @Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Find upcoming events (start time > now)
    @Query("SELECT e FROM Event e WHERE e.startTime > :now AND e.status = 'SCHEDULED' ORDER BY e.startTime")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);
    
    // Find upcoming events by faculty
    @Query("SELECT e FROM Event e WHERE e.faculty = :faculty AND e.startTime > :now AND e.status = 'SCHEDULED' ORDER BY e.startTime")
    List<Event> findUpcomingEventsByFaculty(@Param("faculty") User faculty, @Param("now") LocalDateTime now);
    
    // Find events happening now (start time <= now <= end time)
    @Query("SELECT e FROM Event e WHERE e.startTime <= :now AND e.endTime >= :now AND e.status = 'SCHEDULED' ORDER BY e.startTime")
    List<Event> findCurrentEvents(@Param("now") LocalDateTime now);
    
    // Find events by faculty happening now
    @Query("SELECT e FROM Event e WHERE e.faculty = :faculty AND e.startTime <= :now AND e.endTime >= :now AND e.status = 'SCHEDULED' ORDER BY e.startTime")
    List<Event> findCurrentEventsByFaculty(@Param("faculty") User faculty, @Param("now") LocalDateTime now);
    
    // Find completed events (end time < now)
    @Query("SELECT e FROM Event e WHERE e.endTime < :now AND e.status = 'COMPLETED' ORDER BY e.endTime DESC")
    List<Event> findCompletedEvents(@Param("now") LocalDateTime now);
    
    // Find completed events by faculty
    @Query("SELECT e FROM Event e WHERE e.faculty = :faculty AND e.endTime < :now AND e.status = 'COMPLETED' ORDER BY e.endTime DESC")
    List<Event> findCompletedEventsByFaculty(@Param("faculty") User faculty, @Param("now") LocalDateTime now);
    
    // Search events by title or description
    @Query("SELECT e FROM Event e WHERE e.faculty = :faculty AND (LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY e.startTime")
    List<Event> searchEventsByFaculty(@Param("faculty") User faculty, @Param("searchTerm") String searchTerm);
    
    // Count events by faculty and status
    long countByFacultyAndStatus(User faculty, Event.EventStatus status);
    
    // Count total events by faculty
    long countByFaculty(User faculty);
    
    // Find events with attendance records
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.attendanceRecords WHERE e.id = :eventId")
    Optional<Event> findByIdWithAttendance(@Param("eventId") Long eventId);
    
    // Find events by faculty with attendance records
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.attendanceRecords WHERE e.faculty = :faculty ORDER BY e.startTime DESC")
    List<Event> findByFacultyWithAttendance(@Param("faculty") User faculty);
    
    // Find events by location
    List<Event> findByLocationContainingIgnoreCase(String location);
    
    // Find events by faculty and location
    List<Event> findByFacultyAndLocationContainingIgnoreCase(User faculty, String location);
    
    // Find events by event type and faculty
    List<Event> findByEventTypeAndFaculty(Event.EventType eventType, User faculty);
    
    // Delete events by faculty (for cleanup)
    void deleteByFaculty(User faculty);
    
    // Check if event exists by faculty and title and start time
    boolean existsByFacultyAndTitleAndStartTime(User faculty, String title, LocalDateTime startTime);
}
