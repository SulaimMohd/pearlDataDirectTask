package com.pearldata.controller;

import com.pearldata.dto.SignupRequest;
import com.pearldata.entity.User;
import com.pearldata.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

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
}
