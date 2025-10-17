package com.pearldata.controller;

import com.pearldata.dto.CreateStudentDTO;
import com.pearldata.dto.StudentResponseDTO;
import com.pearldata.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    @Autowired
    private StudentService studentService;

    // Create student
    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody CreateStudentDTO createStudentDTO) {
        try {
            StudentResponseDTO student = studentService.createStudent(createStudentDTO);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student created successfully",
                "data", student
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Get all students
    @GetMapping
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
    @GetMapping("/{studentId}")
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

    // Get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable String email) {
        try {
            Optional<StudentResponseDTO> student = studentService.getStudentByEmail(email);
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

    // Get student by student ID
    @GetMapping("/student-id/{studentId}")
    public ResponseEntity<?> getStudentByStudentId(@PathVariable String studentId) {
        try {
            Optional<StudentResponseDTO> student = studentService.getStudentByStudentId(studentId);
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

    // Update student
    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @Valid @RequestBody CreateStudentDTO updateStudentDTO) {
        try {
            StudentResponseDTO student = studentService.updateStudent(studentId, updateStudentDTO);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student updated successfully",
                "data", student
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Deactivate student
    @PutMapping("/{studentId}/deactivate")
    public ResponseEntity<?> deactivateStudent(@PathVariable Long studentId) {
        try {
            studentService.deactivateStudent(studentId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student deactivated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Activate student
    @PutMapping("/{studentId}/activate")
    public ResponseEntity<?> activateStudent(@PathVariable Long studentId) {
        try {
            studentService.activateStudent(studentId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student activated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // Search students by name
    @GetMapping("/search/name")
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

    // Search students by name or email
    @GetMapping("/search")
    public ResponseEntity<?> searchStudentsByNameOrEmail(@RequestParam String query) {
        try {
            List<StudentResponseDTO> students = studentService.searchStudentsByNameOrEmail(query);
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

    // Search students by student ID
    @GetMapping("/search/student-id")
    public ResponseEntity<?> searchStudentsByStudentId(@RequestParam String query) {
        try {
            List<StudentResponseDTO> students = studentService.searchStudentsByStudentId(query);
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
    @GetMapping("/department/{department}")
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
    @GetMapping("/course/{course}")
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

    // Get students by academic year
    @GetMapping("/academic-year/{academicYear}")
    public ResponseEntity<?> getStudentsByAcademicYear(@PathVariable String academicYear) {
        try {
            List<StudentResponseDTO> students = studentService.getStudentsByAcademicYear(academicYear);
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
    @GetMapping("/statistics")
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

    // Get student statistics
    @GetMapping("/statistics/summary")
    public ResponseEntity<?> getStudentStatistics() {
        try {
            StudentService.StudentStatisticsDTO stats = studentService.getStudentStatistics();
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
