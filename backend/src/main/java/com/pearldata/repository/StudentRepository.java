package com.pearldata.repository;

import com.pearldata.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find by email
    Optional<Student> findByEmail(String email);
    
    // Find by student ID
    Optional<Student> findByStudentId(String studentId);
    
    // Find by phone number
    Optional<Student> findByPhoneNumber(String phoneNumber);
    
    // Find active students
    List<Student> findByIsActiveTrue();
    
    // Find inactive students
    List<Student> findByIsActiveFalse();
    
    // Find students by department
    List<Student> findByDepartment(String department);
    
    // Find students by course
    List<Student> findByCourse(String course);
    
    // Find students by academic year
    List<Student> findByAcademicYear(String academicYear);
    
    // Find students by semester
    List<Student> findBySemester(String semester);
    
    // Find students by department and course
    List<Student> findByDepartmentAndCourse(String department, String course);
    
    // Find students by department and academic year
    List<Student> findByDepartmentAndAcademicYear(String department, String academicYear);
    
    // Find students by department, course, and academic year
    List<Student> findByDepartmentAndCourseAndAcademicYear(String department, String course, String academicYear);
    
    // Search students by name
    @Query("SELECT s FROM Student s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY s.name")
    List<Student> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    // Search students by name or email
    @Query("SELECT s FROM Student s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY s.name")
    List<Student> findByNameOrEmailContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    // Search students by student ID
    @Query("SELECT s FROM Student s WHERE LOWER(s.studentId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY s.studentId")
    List<Student> findByStudentIdContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    // Find students with attendance records
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.attendanceRecords WHERE s.id = :studentId")
    Optional<Student> findByIdWithAttendance(@Param("studentId") Long studentId);
    
    // Find all students with attendance records
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.attendanceRecords ORDER BY s.name")
    List<Student> findAllWithAttendance();
    
    // Find active students with attendance records
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.attendanceRecords WHERE s.isActive = true ORDER BY s.name")
    List<Student> findActiveStudentsWithAttendance();
    
    // Count students by department
    long countByDepartment(String department);
    
    // Count students by course
    long countByCourse(String course);
    
    // Count students by academic year
    long countByAcademicYear(String academicYear);
    
    // Count active students
    long countByIsActiveTrue();
    
    // Count inactive students
    long countByIsActiveFalse();
    
    // Find students with pagination
    Page<Student> findAll(Pageable pageable);
    
    // Find active students with pagination
    Page<Student> findByIsActiveTrue(Pageable pageable);
    
    // Find students by department with pagination
    Page<Student> findByDepartment(String department, Pageable pageable);
    
    // Find students by course with pagination
    Page<Student> findByCourse(String course, Pageable pageable);
    
    // Find students by department and course with pagination
    Page<Student> findByDepartmentAndCourse(String department, String course, Pageable pageable);
    
    // Find students with attendance statistics
    @Query("SELECT s, COUNT(a.id) as attendanceCount, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absentCount " +
           "FROM Student s LEFT JOIN s.attendanceRecords a " +
           "WHERE s.isActive = true " +
           "GROUP BY s.id " +
           "ORDER BY s.name")
    List<Object[]> findStudentsWithAttendanceStats();
    
    // Find students with attendance statistics by department
    @Query("SELECT s, COUNT(a.id) as attendanceCount, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absentCount " +
           "FROM Student s LEFT JOIN s.attendanceRecords a " +
           "WHERE s.isActive = true AND s.department = :department " +
           "GROUP BY s.id " +
           "ORDER BY s.name")
    List<Object[]> findStudentsWithAttendanceStatsByDepartment(@Param("department") String department);
    
    // Find students with attendance statistics by course
    @Query("SELECT s, COUNT(a.id) as attendanceCount, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absentCount " +
           "FROM Student s LEFT JOIN s.attendanceRecords a " +
           "WHERE s.isActive = true AND s.course = :course " +
           "GROUP BY s.id " +
           "ORDER BY s.name")
    List<Object[]> findStudentsWithAttendanceStatsByCourse(@Param("course") String course);
    
    // Check if student exists by email
    boolean existsByEmail(String email);
    
    // Check if student exists by student ID
    boolean existsByStudentId(String studentId);
    
    // Check if student exists by phone number
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Find students by multiple criteria
    @Query("SELECT s FROM Student s WHERE " +
           "(:department IS NULL OR s.department = :department) AND " +
           "(:course IS NULL OR s.course = :course) AND " +
           "(:academicYear IS NULL OR s.academicYear = :academicYear) AND " +
           "(:semester IS NULL OR s.semester = :semester) AND " +
           "s.isActive = true " +
           "ORDER BY s.name")
    List<Student> findStudentsByCriteria(@Param("department") String department,
                                        @Param("course") String course,
                                        @Param("academicYear") String academicYear,
                                        @Param("semester") String semester);
}
