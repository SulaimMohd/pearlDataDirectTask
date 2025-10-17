package com.pearldata.controller;

import com.pearldata.service.SmsService;
import com.pearldata.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class SmsTestController {

    @Autowired
    private SmsService smsService;

    @Autowired
    private WhatsAppService whatsAppService;

    /**
     * Test SMS sending functionality
     * Only accessible by ADMIN role
     */
    @PostMapping("/sms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testSms(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String message = request.get("message");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (message == null || message.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Message is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!smsService.isValidIndianPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Format phone number
            String formattedPhone = smsService.formatPhoneNumber(phoneNumber);
            
            // Send SMS
            boolean sent = smsService.sendSms(formattedPhone, message);
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "SMS sent successfully");
                response.put("phoneNumber", formattedPhone);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send SMS");
                response.put("phoneNumber", formattedPhone);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send SMS: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test event notification SMS
     */
    @PostMapping("/sms/event-notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testEventNotificationSms(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String studentName = request.getOrDefault("studentName", "Test Student");
            String eventTitle = request.getOrDefault("eventTitle", "Test Event");
            String eventDate = request.getOrDefault("eventDate", "Dec 17, 2024");
            String eventTime = request.getOrDefault("eventTime", "10:00");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!smsService.isValidIndianPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Format phone number
            String formattedPhone = smsService.formatPhoneNumber(phoneNumber);
            
            // Send event notification SMS
            boolean sent = smsService.sendEventNotification(
                studentName, formattedPhone, eventTitle, eventDate, eventTime
            );
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "Event notification SMS sent successfully");
                response.put("phoneNumber", formattedPhone);
                response.put("studentName", studentName);
                response.put("eventTitle", eventTitle);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send event notification SMS");
                response.put("phoneNumber", formattedPhone);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send event notification SMS: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test attendance notification SMS
     */
    @PostMapping("/sms/attendance-notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testAttendanceNotificationSms(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String studentName = request.getOrDefault("studentName", "Test Student");
            String eventTitle = request.getOrDefault("eventTitle", "Test Event");
            String attendanceStatus = request.getOrDefault("attendanceStatus", "Present ✅");
            String marksInfo = request.get("marksInfo");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!smsService.isValidIndianPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Format phone number
            String formattedPhone = smsService.formatPhoneNumber(phoneNumber);
            
            // Send attendance notification SMS
            boolean sent = smsService.sendAttendanceNotification(
                studentName, formattedPhone, eventTitle, attendanceStatus, marksInfo
            );
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "Attendance notification SMS sent successfully");
                response.put("phoneNumber", formattedPhone);
                response.put("studentName", studentName);
                response.put("eventTitle", eventTitle);
                response.put("attendanceStatus", attendanceStatus);
                response.put("marksInfo", marksInfo);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send attendance notification SMS");
                response.put("phoneNumber", formattedPhone);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send attendance notification SMS: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test WhatsApp messaging functionality
     */
    @PostMapping("/whatsapp")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testWhatsApp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String message = request.get("message");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (message == null || message.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Message is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if WhatsApp is enabled
            if (!whatsAppService.isWhatsAppEnabled()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "WhatsApp service is disabled");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!whatsAppService.isValidWhatsAppPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Send WhatsApp message
            boolean sent = whatsAppService.sendWhatsAppMessage(phoneNumber, message);
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "WhatsApp message sent successfully");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
            } else {
                response.put("success", false);
                response.put("message", "Failed to send WhatsApp message");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send WhatsApp message: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test event notification WhatsApp
     */
    @PostMapping("/whatsapp/event-notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testEventNotificationWhatsApp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String studentName = request.getOrDefault("studentName", "Test Student");
            String eventTitle = request.getOrDefault("eventTitle", "Test Event");
            String eventDate = request.getOrDefault("eventDate", "Dec 17, 2024");
            String eventTime = request.getOrDefault("eventTime", "10:00");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if WhatsApp is enabled
            if (!whatsAppService.isWhatsAppEnabled()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "WhatsApp service is disabled");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!whatsAppService.isValidWhatsAppPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Send event notification WhatsApp
            boolean sent = whatsAppService.sendEventNotificationWhatsApp(
                studentName, phoneNumber, eventTitle, eventDate, eventTime
            );
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "Event notification WhatsApp sent successfully");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
                response.put("studentName", studentName);
                response.put("eventTitle", eventTitle);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send event notification WhatsApp");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send event notification WhatsApp: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test attendance notification WhatsApp
     */
    @PostMapping("/whatsapp/attendance-notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testAttendanceNotificationWhatsApp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String studentName = request.getOrDefault("studentName", "Test Student");
            String eventTitle = request.getOrDefault("eventTitle", "Test Event");
            String attendanceStatus = request.getOrDefault("attendanceStatus", "Present ✅");
            String marksInfo = request.get("marksInfo");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if WhatsApp is enabled
            if (!whatsAppService.isWhatsAppEnabled()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "WhatsApp service is disabled");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate phone number
            if (!whatsAppService.isValidWhatsAppPhoneNumber(phoneNumber)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Indian phone number format");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Send attendance notification WhatsApp
            boolean sent = whatsAppService.sendAttendanceNotificationWhatsApp(
                studentName, phoneNumber, eventTitle, attendanceStatus, marksInfo
            );
            
            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "Attendance notification WhatsApp sent successfully");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
                response.put("studentName", studentName);
                response.put("eventTitle", eventTitle);
                response.put("attendanceStatus", attendanceStatus);
                response.put("marksInfo", marksInfo);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send attendance notification WhatsApp");
                response.put("phoneNumber", whatsAppService.formatWhatsAppNumber(phoneNumber));
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send attendance notification WhatsApp: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test WhatsApp service status
     */
    @GetMapping("/whatsapp/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getWhatsAppStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("enabled", whatsAppService.isWhatsAppEnabled());
        response.put("message", whatsAppService.isWhatsAppEnabled() ? "WhatsApp service is enabled" : "WhatsApp service is disabled");
        return ResponseEntity.ok(response);
    }
}
