package com.pearldata.controller;

import com.pearldata.dto.LoginRequest;
import com.pearldata.dto.LoginResponse;
import com.pearldata.dto.SignupRequest;
import com.pearldata.entity.User;
import com.pearldata.security.JwtUtil;
import com.pearldata.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = signupRequest.toUser();
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.getUserByEmailOrPhone(
                loginRequest.getEmailOrPhone(), 
                loginRequest.getEmailOrPhone()
            );

            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email/phone or password");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userOpt.get();
            
            if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email/phone or password");
                return ResponseEntity.badRequest().body(error);
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
            
            LoginResponse loginResponse = new LoginResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getPhoneNumber()
            );

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);
                Long userId = jwtUtil.extractUserId(token);

                if (jwtUtil.validateToken(token, username)) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("username", username);
                    response.put("role", role);
                    response.put("userId", userId);
                    return ResponseEntity.ok(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
