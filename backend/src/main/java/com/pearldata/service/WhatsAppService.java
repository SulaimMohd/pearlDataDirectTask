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
public class WhatsAppService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.enabled:false}")
    private boolean whatsappEnabled;

    @Value("${twilio.whatsapp.sandbox.from}")
    private String whatsappFromNumber;

    @Value("${twilio.whatsapp.sandbox.to-prefix}")
    private String whatsappToPrefix;

    @PostConstruct
    public void init() {
        if (whatsappEnabled) {
            Twilio.init(accountSid, authToken);
            logger.info("WhatsApp service initialized successfully");
        } else {
            logger.info("WhatsApp service is disabled");
        }
    }

    /**
     * Send WhatsApp message to a single phone number
     */
    public boolean sendWhatsAppMessage(String toPhoneNumber, String message) {
        if (!whatsappEnabled) {
            logger.warn("WhatsApp service is disabled");
            return false;
        }

        try {
            logger.info("Sending WhatsApp message to: {}", toPhoneNumber);
            logger.info("Message: {}", message);

            // Format phone number for WhatsApp
            String formattedToNumber = formatWhatsAppNumber(toPhoneNumber);
            
            Message whatsappMessage = Message.creator(
                    new PhoneNumber(formattedToNumber),
                    new PhoneNumber(whatsappFromNumber),
                    message
            ).create();

            logger.info("WhatsApp message sent successfully. SID: {}", whatsappMessage.getSid());
            return true;

        } catch (Exception e) {
            logger.error("Failed to send WhatsApp message to {}: {}", toPhoneNumber, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Send event notification WhatsApp message to students
     */
    public boolean sendEventNotificationWhatsApp(String studentName, String studentPhone, String eventTitle, String eventDate, String eventTime) {
        String message = String.format(
            "🎓 *PearlData University*\n\n" +
            "Hello *%s*!\n\n" +
            "📅 *New Event Notification*\n" +
            "📚 Event: *%s*\n" +
            "📆 Date: %s\n" +
            "⏰ Time: %s\n\n" +
            "Please check your student portal for more details.\n\n" +
            "_PearlData University - Excellence in Education_",
            studentName, eventTitle, eventDate, eventTime
        );
        
        return sendWhatsAppMessage(studentPhone, message);
    }

    /**
     * Send attendance update notification WhatsApp message to students
     */
    public boolean sendAttendanceNotificationWhatsApp(String studentName, String studentPhone, String eventTitle, String attendanceStatus, String marksInfo) {
        String message = String.format(
            "📚 *PearlData University*\n\n" +
            "Hello *%s*!\n\n" +
            "📊 *Attendance Update*\n" +
            "📚 Event: *%s*\n" +
            "✅ Status: *%s*%s\n\n" +
            "_PearlData University - Excellence in Education_",
            studentName, 
            eventTitle, 
            attendanceStatus,
            marksInfo != null ? "\n🎯 Marks: *" + marksInfo + "*" : ""
        );
        
        return sendWhatsAppMessage(studentPhone, message);
    }

    /**
     * Send bulk WhatsApp messages to multiple phone numbers
     */
    public int sendBulkWhatsAppMessages(String[] phoneNumbers, String message) {
        if (!whatsappEnabled) {
            logger.warn("WhatsApp service is disabled");
            return 0;
        }

        int successCount = 0;
        
        for (String phoneNumber : phoneNumbers) {
            if (sendWhatsAppMessage(phoneNumber, message)) {
                successCount++;
            }
            
            // Add delay to avoid rate limiting
            try {
                Thread.sleep(500); // WhatsApp has stricter rate limits than SMS
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        logger.info("Bulk WhatsApp messages completed. Sent: {}/{}", successCount, phoneNumbers.length);
        return successCount;
    }

    /**
     * Validate phone number format for WhatsApp
     */
    public boolean isValidWhatsAppPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove any spaces or special characters except +
        String cleanNumber = phoneNumber.replaceAll("[\\s-]", "");
        
        // Check if it's a valid Indian mobile number
        return cleanNumber.matches("^\\+91[6-9]\\d{9}$");
    }

    /**
     * Format phone number for WhatsApp (add whatsapp: prefix)
     */
    public String formatWhatsAppNumber(String phoneNumber) {
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
        
        // Add WhatsApp prefix
        return whatsappToPrefix + cleanNumber.substring(3); // Remove +91 and add whatsapp:+91
    }

    /**
     * Check if WhatsApp service is enabled
     */
    public boolean isWhatsAppEnabled() {
        return whatsappEnabled;
    }

    /**
     * Send a test WhatsApp message
     */
    public boolean sendTestWhatsAppMessage(String phoneNumber, String testMessage) {
        String message = String.format(
            "🧪 *PearlData University - WhatsApp Test*\n\n" +
            "This is a test message to verify WhatsApp integration.\n\n" +
            "Test Message: %s\n\n" +
            "✅ WhatsApp service is working correctly!\n\n" +
            "_PearlData University - Excellence in Education_",
            testMessage
        );
        
        return sendWhatsAppMessage(phoneNumber, message);
    }
}
