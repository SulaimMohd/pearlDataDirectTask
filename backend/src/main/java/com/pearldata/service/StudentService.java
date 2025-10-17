package com.pearldata.service;

import com.pearldata.dto.AdminCreateStudentDTO;
import com.pearldata.dto.CreateStudentDTO;
import com.pearldata.dto.StudentResponseDTO;
import com.pearldata.entity.Student;
import com.pearldata.entity.User;
import com.pearldata.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Create student
    public StudentResponseDTO createStudent(CreateStudentDTO createStudentDTO) {
        // Check if email already exists
        if (studentRepository.existsByEmail(createStudentDTO.getEmail())) {
            throw new RuntimeException("Student with this email already exists");
        }

        // Check if student ID already exists
        if (studentRepository.existsByStudentId(createStudentDTO.getStudentId())) {
            throw new RuntimeException("Student with this ID already exists");
        }

        // Check if phone number already exists
        if (studentRepository.existsByPhoneNumber(createStudentDTO.getPhoneNumber())) {
            throw new RuntimeException("Student with this phone number already exists");
        }

        // Create student
        Student student = new Student();
        student.setName(createStudentDTO.getName());
        student.setEmail(createStudentDTO.getEmail());
        student.setPhoneNumber(createStudentDTO.getPhoneNumber());
        student.setBio(createStudentDTO.getBio());
        student.setStudentId(createStudentDTO.getStudentId());
        student.setDepartment(createStudentDTO.getDepartment());
        student.setCourse(createStudentDTO.getCourse());
        student.setAcademicYear(createStudentDTO.getAcademicYear());
        student.setSemester(createStudentDTO.getSemester());
        student.setIsActive(true);

        Student savedStudent = studentRepository.save(student);

        // Create corresponding user account
        User user = new User();
        user.setName(createStudentDTO.getName());
        user.setEmail(createStudentDTO.getEmail());
        user.setPhoneNumber(createStudentDTO.getPhoneNumber());
        user.setBio(createStudentDTO.getBio());
        user.setRole(User.Role.STUDENT);
        user.setPassword("student123"); // Default password for regular student creation
        userService.createUser(user);

        return new StudentResponseDTO(savedStudent);
    }

    // Create student with password (for admin creation)
    public StudentResponseDTO createStudentWithPassword(AdminCreateStudentDTO adminCreateStudentDTO) {
        // Check if student already exists with this email
        if (studentRepository.existsByEmail(adminCreateStudentDTO.getEmail())) {
            throw new RuntimeException("Student with this email already exists");
        }
        if (studentRepository.existsByStudentId(adminCreateStudentDTO.getStudentId())) {
            throw new RuntimeException("Student with this student ID already exists");
        }

        // Generate a unique student ID if not provided
        String studentId = adminCreateStudentDTO.getStudentId();
        if (studentId == null || studentId.trim().isEmpty()) {
            studentId = generateUniqueStudentId();
        }

        // Create student entity
        Student student = new Student();
        student.setName(adminCreateStudentDTO.getName());
        student.setEmail(adminCreateStudentDTO.getEmail());
        student.setPhoneNumber(adminCreateStudentDTO.getPhoneNumber());
        student.setBio(adminCreateStudentDTO.getBio());
        student.setStudentId(studentId);
        student.setDepartment(adminCreateStudentDTO.getDepartment());
        student.setCourse(adminCreateStudentDTO.getCourse());
        student.setAcademicYear(adminCreateStudentDTO.getAcademicYear());
        student.setSemester(adminCreateStudentDTO.getSemester());
        student.setIsActive(true);

        Student savedStudent = studentRepository.save(student);

        // Create corresponding user account with provided password
        User user = new User();
        user.setName(adminCreateStudentDTO.getName());
        user.setEmail(adminCreateStudentDTO.getEmail());
        user.setPhoneNumber(adminCreateStudentDTO.getPhoneNumber());
        user.setBio(adminCreateStudentDTO.getBio());
        user.setRole(User.Role.STUDENT);
        user.setPassword(adminCreateStudentDTO.getPassword()); // Use provided password (will be encoded by createUser)
        userService.createUser(user);

        return new StudentResponseDTO(savedStudent);
    }

    // Create student from User entity (for admin creation)
    public StudentResponseDTO createStudentFromUser(User user) {
        // Check if student already exists with this email
        if (studentRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Student with this email already exists");
        }

        // Generate a unique student ID
        String studentId = generateUniqueStudentId();

        // Create student entity
        Student student = new Student();
        student.setName(user.getName());
        student.setEmail(user.getEmail());
        student.setPhoneNumber(user.getPhoneNumber());
        student.setBio(user.getBio());
        student.setStudentId(studentId);
        student.setDepartment("Computer Science"); // Default department
        student.setCourse("Bachelor of Technology"); // Default course
        student.setAcademicYear("2024"); // Default academic year
        student.setSemester("1"); // Default semester
        student.setIsActive(true);

        Student savedStudent = studentRepository.save(student);
        return new StudentResponseDTO(savedStudent);
    }

    // Generate unique student ID
    private String generateUniqueStudentId() {
        String prefix = "CS";
        int year = java.time.Year.now().getValue();
        
        // Get the count of students created this year
        long count = studentRepository.count();
        String sequence = String.format("%04d", count + 1);
        
        return prefix + year + sequence;
    }

    // Get student by ID
    @Transactional(readOnly = true)
    public Optional<StudentResponseDTO> getStudentById(Long studentId) {
        return studentRepository.findById(studentId)
                .map(StudentResponseDTO::new);
    }

    // Get student entity by ID (for internal use)
    @Transactional(readOnly = true)
    public Student getStudentEntityById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // Update student
    @Transactional
    public Student updateStudent(Long studentId, Student studentData) {
        Student student = getStudentEntityById(studentId);
        
        // Update allowed fields
        if (studentData.getName() != null) {
            student.setName(studentData.getName());
        }
        if (studentData.getPhoneNumber() != null) {
            student.setPhoneNumber(studentData.getPhoneNumber());
        }
        if (studentData.getBio() != null) {
            student.setBio(studentData.getBio());
        }
        if (studentData.getDepartment() != null) {
            student.setDepartment(studentData.getDepartment());
        }
        if (studentData.getCourse() != null) {
            student.setCourse(studentData.getCourse());
        }
        if (studentData.getAcademicYear() != null) {
            student.setAcademicYear(studentData.getAcademicYear());
        }
        if (studentData.getSemester() != null) {
            student.setSemester(studentData.getSemester());
        }
        
        return studentRepository.save(student);
    }


    // Get student by ID with attendance
    @Transactional(readOnly = true)
    public Optional<StudentResponseDTO> getStudentByIdWithAttendance(Long studentId) {
        return studentRepository.findByIdWithAttendance(studentId)
                .map(student -> {
                    StudentResponseDTO dto = new StudentResponseDTO(student);
                    // Add attendance statistics
                    if (student.getAttendanceRecords() != null) {
                        long totalRecords = student.getAttendanceRecords().size();
                        long presentCount = student.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.isPresent() ? 1 : 0)
                                .sum();
                        long absentCount = student.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.getStatus() == com.pearldata.entity.Attendance.AttendanceStatus.ABSENT ? 1 : 0)
                                .sum();
                        long lateCount = student.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.getStatus() == com.pearldata.entity.Attendance.AttendanceStatus.LATE ? 1 : 0)
                                .sum();
                        long excusedCount = student.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.getStatus() == com.pearldata.entity.Attendance.AttendanceStatus.EXCUSED ? 1 : 0)
                                .sum();
                        
                        dto.setTotalAttendanceRecords(totalRecords);
                        dto.setPresentCount(presentCount);
                        dto.setAbsentCount(absentCount);
                        dto.setLateCount(lateCount);
                        dto.setExcusedCount(excusedCount);
                        dto.setAttendancePercentage(totalRecords > 0 ? (double) presentCount / totalRecords * 100 : 0.0);
                    }
                    return dto;
                });
    }

    // Get student by email
    @Transactional(readOnly = true)
    public Optional<StudentResponseDTO> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .map(StudentResponseDTO::new);
    }

    // Get student entity by email
    @Transactional(readOnly = true)
    public Optional<Student> getStudentEntityByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    // Get student by student ID
    @Transactional(readOnly = true)
    public Optional<StudentResponseDTO> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .map(StudentResponseDTO::new);
    }

    // Get all students
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findActiveStudentsWithAttendance()
                .stream()
                .map(student -> {
                    StudentResponseDTO dto = new StudentResponseDTO(student);
                    // Add attendance statistics
                    if (student.getAttendanceRecords() != null) {
                        long totalRecords = student.getAttendanceRecords().size();
                        long presentCount = student.getAttendanceRecords().stream()
                                .mapToLong(attendance -> attendance.isPresent() ? 1 : 0)
                                .sum();
                        
                        dto.setTotalAttendanceRecords(totalRecords);
                        dto.setPresentCount(presentCount);
                        dto.setAttendancePercentage(totalRecords > 0 ? (double) presentCount / totalRecords * 100 : 0.0);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get all students as list (for analytics)
    @Transactional(readOnly = true)
    public List<Student> getAllStudentsList() {
        return studentRepository.findActiveStudentsWithAttendance();
    }

    // Get students with pagination
    @Transactional(readOnly = true)
    public Page<StudentResponseDTO> getStudents(Pageable pageable) {
        return studentRepository.findByIsActiveTrue(pageable)
                .map(StudentResponseDTO::new);
    }

    // Get students by department
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get students by course
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByCourse(String course) {
        return studentRepository.findByCourse(course)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get students by academic year
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByAcademicYear(String academicYear) {
        return studentRepository.findByAcademicYear(academicYear)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get students by department and course
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByDepartmentAndCourse(String department, String course) {
        return studentRepository.findByDepartmentAndCourse(department, course)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Search students by name
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> searchStudentsByName(String searchTerm) {
        return studentRepository.findByNameContainingIgnoreCase(searchTerm)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Search students by name or email
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> searchStudentsByNameOrEmail(String searchTerm) {
        return studentRepository.findByNameOrEmailContainingIgnoreCase(searchTerm)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Search students by student ID
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> searchStudentsByStudentId(String searchTerm) {
        return studentRepository.findByStudentIdContainingIgnoreCase(searchTerm)
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get students with attendance statistics
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsWithAttendanceStatistics() {
        List<Object[]> results = studentRepository.findStudentsWithAttendanceStats();
        
        return results.stream()
                .map(result -> {
                    Student student = (Student) result[0];
                    Long totalAttendance = (Long) result[1];
                    Long presentCount = (Long) result[2];
                    Long absentCount = (Long) result[3];
                    
                    StudentResponseDTO dto = new StudentResponseDTO(student);
                    dto.setTotalAttendanceRecords(totalAttendance);
                    dto.setPresentCount(presentCount);
                    dto.setAbsentCount(absentCount);
                    dto.setAttendancePercentage(totalAttendance > 0 ? (double) presentCount / totalAttendance * 100 : 0.0);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get students with attendance statistics by department
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsWithAttendanceStatisticsByDepartment(String department) {
        List<Object[]> results = studentRepository.findStudentsWithAttendanceStatsByDepartment(department);
        
        return results.stream()
                .map(result -> {
                    Student student = (Student) result[0];
                    Long totalAttendance = (Long) result[1];
                    Long presentCount = (Long) result[2];
                    Long absentCount = (Long) result[3];
                    
                    StudentResponseDTO dto = new StudentResponseDTO(student);
                    dto.setTotalAttendanceRecords(totalAttendance);
                    dto.setPresentCount(presentCount);
                    dto.setAbsentCount(absentCount);
                    dto.setAttendancePercentage(totalAttendance > 0 ? (double) presentCount / totalAttendance * 100 : 0.0);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Update student
    public StudentResponseDTO updateStudent(Long studentId, CreateStudentDTO updateStudentDTO) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check for duplicate email
        if (!student.getEmail().equals(updateStudentDTO.getEmail()) && 
            studentRepository.existsByEmail(updateStudentDTO.getEmail())) {
            throw new RuntimeException("Student with this email already exists");
        }

        // Check for duplicate student ID
        if (!student.getStudentId().equals(updateStudentDTO.getStudentId()) && 
            studentRepository.existsByStudentId(updateStudentDTO.getStudentId())) {
            throw new RuntimeException("Student with this ID already exists");
        }

        // Check for duplicate phone number
        if (!student.getPhoneNumber().equals(updateStudentDTO.getPhoneNumber()) && 
            studentRepository.existsByPhoneNumber(updateStudentDTO.getPhoneNumber())) {
            throw new RuntimeException("Student with this phone number already exists");
        }

        // Update fields
        student.setName(updateStudentDTO.getName());
        student.setEmail(updateStudentDTO.getEmail());
        student.setPhoneNumber(updateStudentDTO.getPhoneNumber());
        student.setBio(updateStudentDTO.getBio());
        student.setStudentId(updateStudentDTO.getStudentId());
        student.setDepartment(updateStudentDTO.getDepartment());
        student.setCourse(updateStudentDTO.getCourse());
        student.setAcademicYear(updateStudentDTO.getAcademicYear());
        student.setSemester(updateStudentDTO.getSemester());

        Student updatedStudent = studentRepository.save(student);
        
        // Update corresponding user account
        User user = userService.getUserByEmail(student.getEmail()).orElse(null);
        if (user != null) {
            user.setName(updateStudentDTO.getName());
            user.setEmail(updateStudentDTO.getEmail());
            user.setPhoneNumber(updateStudentDTO.getPhoneNumber());
            user.setBio(updateStudentDTO.getBio());
            userService.saveUser(user);
        }

        return new StudentResponseDTO(updatedStudent);
    }

    // Deactivate student
    public void deactivateStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setIsActive(false);
        studentRepository.save(student);

        // Deactivate corresponding user account
        User user = userService.getUserByEmail(student.getEmail()).orElse(null);
        if (user != null) {
            user.setIsActive(false);
            userService.saveUser(user);
        }
    }

    // Activate student
    public void activateStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setIsActive(true);
        studentRepository.save(student);

        // Activate corresponding user account
        User user = userService.getUserByEmail(student.getEmail()).orElse(null);
        if (user != null) {
            user.setIsActive(true);
            userService.saveUser(user);
        }
    }

    // Count all students
    @Transactional(readOnly = true)
    public long countAllStudents() {
        return studentRepository.count();
    }

    // Get student statistics
    @Transactional(readOnly = true)
    public StudentStatisticsDTO getStudentStatistics() {
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.countByIsActiveTrue();
        long inactiveStudents = studentRepository.countByIsActiveFalse();
        
        // Get unique departments and courses
        List<String> departments = studentRepository.findAll()
                .stream()
                .map(Student::getDepartment)
                .distinct()
                .filter(dept -> dept != null && !dept.isEmpty())
                .collect(Collectors.toList());
        
        List<String> courses = studentRepository.findAll()
                .stream()
                .map(Student::getCourse)
                .distinct()
                .filter(course -> course != null && !course.isEmpty())
                .collect(Collectors.toList());

        return new StudentStatisticsDTO(totalStudents, activeStudents, inactiveStudents, departments, courses);
    }

    // Inner class for statistics
    public static class StudentStatisticsDTO {
        private long totalStudents;
        private long activeStudents;
        private long inactiveStudents;
        private List<String> departments;
        private List<String> courses;

        public StudentStatisticsDTO(long totalStudents, long activeStudents, long inactiveStudents, 
                                   List<String> departments, List<String> courses) {
            this.totalStudents = totalStudents;
            this.activeStudents = activeStudents;
            this.inactiveStudents = inactiveStudents;
            this.departments = departments;
            this.courses = courses;
        }

        // Getters
        public long getTotalStudents() { return totalStudents; }
        public long getActiveStudents() { return activeStudents; }
        public long getInactiveStudents() { return inactiveStudents; }
        public List<String> getDepartments() { return departments; }
        public List<String> getCourses() { return courses; }
    }
}
