#!/bin/bash

# PearlData University - Backend Startup Script with Environment Variables
# This script sets up environment variables and starts the Spring Boot application

echo "🚀 Starting PearlData University Backend with Environment Variables..."

# Database Configuration
export DATABASE_URL="jdbc:postgresql://localhost:5432/postgres"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="1111"

# JWT Configuration
export JWT_SECRET="mySecretKeyForPearlDataApplication2024"
export JWT_EXPIRATION="86400000"

# Twilio SMS Configuration
export TWILIO_ACCOUNT_SID="YOUR_TWILIO_ACCOUNT_SID_HERE"
export TWILIO_AUTH_TOKEN="YOUR_TWILIO_AUTH_TOKEN_HERE"
export TWILIO_PHONE_NUMBER="+15074323599"

# Twilio WhatsApp Configuration
export TWILIO_WHATSAPP_ENABLED="true"
export TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"
export TWILIO_WHATSAPP_TO_PREFIX="whatsapp:+91"

echo "✅ Environment variables set successfully"
echo "📱 SMS and WhatsApp services configured"
echo "🔐 JWT authentication configured"
echo "🗄️  Database connection configured"

# Start the Spring Boot application
echo "🎓 Starting PearlData University Backend..."
./mvnw spring-boot:run
