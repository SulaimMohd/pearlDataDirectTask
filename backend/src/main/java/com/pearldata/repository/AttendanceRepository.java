package com.pearldata.repository;

import com.pearldata.entity.Attendance;
import com.pearldata.entity.Event;
import com.pearldata.entity.Student;
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
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Find attendance by student
    List<Attendance> findByStudent(Student student);
    
    // Find attendance by event
    List<Attendance> findByEvent(Event event);
    
    // Find attendance by student and event
    Optional<Attendance> findByStudentAndEvent(Student student, Event event);
    
    // Find attendance by marked by faculty
    List<Attendance> findByMarkedByFaculty(User faculty);
    
    // Find attendance by status
    List<Attendance> findByStatus(Attendance.AttendanceStatus status);
    
    // Find attendance by student and status
    List<Attendance> findByStudentAndStatus(Student student, Attendance.AttendanceStatus status);
    
    // Find attendance by event and status
    List<Attendance> findByEventAndStatus(Event event, Attendance.AttendanceStatus status);
    
    // Find attendance by student with pagination
    Page<Attendance> findByStudent(Student student, Pageable pageable);
    
    // Find attendance by event with pagination
    Page<Attendance> findByEvent(Event event, Pageable pageable);
    
    // Find attendance by marked by faculty with pagination
    Page<Attendance> findByMarkedByFaculty(User faculty, Pageable pageable);
    
    // Find attendance between date range
    @Query("SELECT a FROM Attendance a WHERE a.markedAt BETWEEN :startDate AND :endDate ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Find attendance by student between date range
    @Query("SELECT a FROM Attendance a WHERE a.student = :student AND a.markedAt BETWEEN :startDate AND :endDate ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceByStudentBetweenDates(@Param("student") Student student,
                                                         @Param("startDate") LocalDateTime startDate, 
                                                         @Param("endDate") LocalDateTime endDate);
    
    // Find attendance by faculty between date range
    @Query("SELECT a FROM Attendance a WHERE a.markedByFaculty = :faculty AND a.markedAt BETWEEN :startDate AND :endDate ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceByFacultyBetweenDates(@Param("faculty") User faculty,
                                                         @Param("startDate") LocalDateTime startDate, 
                                                         @Param("endDate") LocalDateTime endDate);
    
    // Find attendance by event between date range
    @Query("SELECT a FROM Attendance a WHERE a.event = :event AND a.markedAt BETWEEN :startDate AND :endDate ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceByEventBetweenDates(@Param("event") Event event,
                                                       @Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate);
    
    // Count attendance by student and status
    long countByStudentAndStatus(Student student, Attendance.AttendanceStatus status);
    
    // Count attendance by event and status
    long countByEventAndStatus(Event event, Attendance.AttendanceStatus status);
    
    // Count total attendance by student
    long countByStudent(Student student);
    
    // Count total attendance by event
    long countByEvent(Event event);
    
    // Count attendance by faculty
    long countByMarkedByFaculty(User faculty);
    
    // Find students with attendance statistics
    @Query("SELECT s, COUNT(a.id) as totalAttendance, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absentCount, " +
           "SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) as lateCount, " +
           "SUM(CASE WHEN a.status = 'EXCUSED' THEN 1 ELSE 0 END) as excusedCount " +
           "FROM Student s LEFT JOIN s.attendanceRecords a " +
           "WHERE s.isActive = true " +
           "GROUP BY s.id " +
           "ORDER BY s.name")
    List<Object[]> findStudentAttendanceStatistics();
    
    // Find students with attendance statistics by event
    @Query("SELECT s, COUNT(a.id) as totalAttendance, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absentCount, " +
           "SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) as lateCount, " +
           "SUM(CASE WHEN a.status = 'EXCUSED' THEN 1 ELSE 0 END) as excusedCount " +
           "FROM Student s LEFT JOIN s.attendanceRecords a ON a.event = :event " +
           "WHERE s.isActive = true " +
           "GROUP BY s.id " +
           "ORDER BY s.name")
    List<Object[]> findStudentAttendanceStatisticsByEvent(@Param("event") Event event);
    
    // Find attendance with student and event details
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.student LEFT JOIN FETCH a.event LEFT JOIN FETCH a.markedByFaculty WHERE a.id = :id")
    Optional<Attendance> findByIdWithDetails(@Param("id") Long id);
    
    // Find attendance by student with event details
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.event WHERE a.student = :student ORDER BY a.markedAt DESC")
    List<Attendance> findByStudentWithEventDetails(@Param("student") Student student);
    
    // Find attendance by event with student details
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.student WHERE a.event = :event ORDER BY a.markedAt DESC")
    List<Attendance> findByEventWithStudentDetails(@Param("event") Event event);
    
    // Find attendance by faculty with student and event details
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.student LEFT JOIN FETCH a.event WHERE a.markedByFaculty = :faculty ORDER BY a.markedAt DESC")
    List<Attendance> findByFacultyWithDetails(@Param("faculty") User faculty);
    
    // Find recent attendance (last N records)
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.student LEFT JOIN FETCH a.event LEFT JOIN FETCH a.markedByFaculty ORDER BY a.markedAt DESC")
    List<Attendance> findRecentAttendance(Pageable pageable);
    
    // Find attendance with marks
    @Query("SELECT a FROM Attendance a WHERE a.marksObtained IS NOT NULL AND a.maxMarks IS NOT NULL ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceWithMarks();
    
    // Find attendance with marks by student
    @Query("SELECT a FROM Attendance a WHERE a.student = :student AND a.marksObtained IS NOT NULL AND a.maxMarks IS NOT NULL ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceWithMarksByStudent(@Param("student") Student student);
    
    // Find attendance with marks by event
    @Query("SELECT a FROM Attendance a WHERE a.event = :event AND a.marksObtained IS NOT NULL AND a.maxMarks IS NOT NULL ORDER BY a.markedAt DESC")
    List<Attendance> findAttendanceWithMarksByEvent(@Param("event") Event event);
    
    // Calculate average marks by student
    @Query("SELECT AVG(a.marksObtained) FROM Attendance a WHERE a.student = :student AND a.marksObtained IS NOT NULL AND a.maxMarks IS NOT NULL")
    Double findAverageMarksByStudent(@Param("student") Student student);
    
    // Calculate average marks by event
    @Query("SELECT AVG(a.marksObtained) FROM Attendance a WHERE a.event = :event AND a.marksObtained IS NOT NULL AND a.maxMarks IS NOT NULL")
    Double findAverageMarksByEvent(@Param("event") Event event);
    
    // Find attendance by status with details
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.student LEFT JOIN FETCH a.event WHERE a.status = :status ORDER BY a.markedAt DESC")
    List<Attendance> findByStatusWithDetails(@Param("status") Attendance.AttendanceStatus status);
    
    // Check if attendance exists for student and event
    boolean existsByStudentAndEvent(Student student, Event event);
    
    // Delete attendance by student
    void deleteByStudent(Student student);
    
    // Delete attendance by event
    void deleteByEvent(Event event);
    
    // Delete attendance by faculty
    void deleteByMarkedByFaculty(User faculty);
}
