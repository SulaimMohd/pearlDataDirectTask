package com.pearldata.controller;

import com.pearldata.dto.SignupRequest;
import com.pearldata.entity.User;
import com.pearldata.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @PostMapping("/users/student")
    public ResponseEntity<?> createStudent(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            if (userService.existsByEmail(signupRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            if (userService.existsByPhoneNumber(signupRequest.getPhoneNumber())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = signupRequest.toUser();
            user.setRole(User.Role.STUDENT);
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student created successfully");
            response.put("user", Map.of(
                "id", createdUser.getId(),
                "name", createdUser.getName(),
                "email", createdUser.getEmail(),
                "role", createdUser.getRole(),
                "phoneNumber", createdUser.getPhoneNumber()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/users/faculty")
    public ResponseEntity<?> createFaculty(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            if (userService.existsByEmail(signupRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            if (userService.existsByPhoneNumber(signupRequest.getPhoneNumber())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = signupRequest.toUser();
            user.setRole(User.Role.FACULTY);
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Faculty created successfully");
            response.put("user", Map.of(
                "id", createdUser.getId(),
                "name", createdUser.getName(),
                "email", createdUser.getEmail(),
                "role", createdUser.getRole(),
                "phoneNumber", createdUser.getPhoneNumber()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/users/admin")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            if (userService.existsByEmail(signupRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            if (userService.existsByPhoneNumber(signupRequest.getPhoneNumber())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = signupRequest.toUser();
            user.setRole(User.Role.ADMIN);
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin created successfully");
            response.put("user", Map.of(
                "id", createdUser.getId(),
                "name", createdUser.getName(),
                "email", createdUser.getEmail(),
                "role", createdUser.getRole(),
                "phoneNumber", createdUser.getPhoneNumber()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Temporary endpoint to promote a user to admin (for initial setup)
    @PutMapping("/promote-to-admin/{userId}")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setRole(User.Role.ADMIN);
            User updatedUser = userService.updateUser(userId, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User promoted to admin successfully");
            response.put("user", Map.of(
                "id", updatedUser.getId(),
                "name", updatedUser.getName(),
                "email", updatedUser.getEmail(),
                "role", updatedUser.getRole()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String searchTerm) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
            Page<User> usersPage = userService.getAllUsers(searchTerm, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usersPage);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userOpt.get());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Update user
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody SignupRequest signupRequest) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            User user = userOpt.get();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPhoneNumber(signupRequest.getPhoneNumber());
            if (signupRequest.getBio() != null) {
                user.setBio(signupRequest.getBio());
            }
            
            User updatedUser = userService.saveUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("data", updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error updating user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            userService.deleteUser(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Search users
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        try {
            List<User> users = userService.searchUsers(q);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error searching users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get dashboard statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Get total counts
            long totalUsers = userService.getTotalUsersCount();
            long totalStudents = userService.getUsersCountByRole(User.Role.STUDENT);
            long totalFaculty = userService.getUsersCountByRole(User.Role.FACULTY);
            long totalAdmins = userService.getUsersCountByRole(User.Role.ADMIN);
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("totalUsers", totalUsers);
            dashboard.put("totalStudents", totalStudents);
            dashboard.put("totalFaculty", totalFaculty);
            dashboard.put("totalAdmins", totalAdmins);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", dashboard);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching dashboard stats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
