package com.pearldata.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
        logger.info("Twilio initialized successfully");
    }

    /**
     * Send SMS to a single phone number
     */
    public boolean sendSms(String toPhoneNumber, String message) {
        try {
            logger.info("Sending SMS to: {}", toPhoneNumber);
            logger.info("Message: {}", message);

            Message smsMessage = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    message
            ).create();

            logger.info("SMS sent successfully. SID: {}", smsMessage.getSid());
            return true;

        } catch (Exception e) {
            logger.error("Failed to send SMS to {}: {}", toPhoneNumber, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Send event notification SMS to students
     */
    public boolean sendEventNotification(String studentName, String studentPhone, String eventTitle, String eventDate, String eventTime) {
        String message = String.format(
            "Hello %s! 🎓\n\nNew Event: %s\nDate: %s\nTime: %s\n\nPlease check your student portal for more details.\n\nPearlData University",
            studentName, eventTitle, eventDate, eventTime
        );
        
        return sendSms(studentPhone, message);
    }

    /**
     * Send attendance update notification SMS to students
     */
    public boolean sendAttendanceNotification(String studentName, String studentPhone, String eventTitle, String attendanceStatus, String marksInfo) {
        String message = String.format(
            "Hello %s! 📚\n\nAttendance Updated for: %s\nStatus: %s%s\n\nPearlData University",
            studentName, 
            eventTitle, 
            attendanceStatus,
            marksInfo != null ? "\nMarks: " + marksInfo : ""
        );
        
        return sendSms(studentPhone, message);
    }

    /**
     * Send bulk SMS to multiple phone numbers
     */
    public int sendBulkSms(String[] phoneNumbers, String message) {
        int successCount = 0;
        
        for (String phoneNumber : phoneNumbers) {
            if (sendSms(phoneNumber, message)) {
                successCount++;
            }
            
            // Add small delay to avoid rate limiting
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        logger.info("Bulk SMS completed. Sent: {}/{}", successCount, phoneNumbers.length);
        return successCount;
    }

    /**
     * Validate phone number format for Indian numbers
     */
    public boolean isValidIndianPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove any spaces or special characters except +
        String cleanNumber = phoneNumber.replaceAll("[\\s-]", "");
        
        // Check if it's a valid Indian mobile number
        return cleanNumber.matches("^\\+91[6-9]\\d{9}$");
    }

    /**
     * Format phone number for Twilio (ensure +91 prefix)
     */
    public String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return null;
        }
        
        String cleanNumber = phoneNumber.replaceAll("[\\s-]", "");
        
        // If it doesn't start with +91, add it
        if (!cleanNumber.startsWith("+91")) {
            if (cleanNumber.startsWith("91") && cleanNumber.length() == 12) {
                cleanNumber = "+" + cleanNumber;
            } else if (cleanNumber.length() == 10 && cleanNumber.matches("^[6-9]\\d{9}$")) {
                cleanNumber = "+91" + cleanNumber;
            }
        }
        
        return cleanNumber;
    }
}
