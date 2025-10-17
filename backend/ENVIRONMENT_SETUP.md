# Environment Variables Setup

This document explains how to set up environment variables for the PearlData University application to keep sensitive information secure.

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_database_password
```

### JWT Configuration
```bash
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=86400000
```

### Twilio SMS Configuration
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Twilio WhatsApp Configuration
```bash
TWILIO_WHATSAPP_ENABLED=true
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO_PREFIX=whatsapp:+91
```

## Setting Up Environment Variables

### Option 1: System Environment Variables (Recommended for Production)

#### On macOS/Linux:
```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/postgres"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="your_password"
export JWT_SECRET="your_jwt_secret"
export TWILIO_ACCOUNT_SID="your_account_sid"
export TWILIO_AUTH_TOKEN="your_auth_token"
export TWILIO_PHONE_NUMBER="+15074323599"
export TWILIO_WHATSAPP_ENABLED="true"
export TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"
export TWILIO_WHATSAPP_TO_PREFIX="whatsapp:+91"
```

#### On Windows:
```cmd
set DATABASE_URL=jdbc:postgresql://localhost:5432/postgres
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=your_password
set JWT_SECRET=your_jwt_secret
set TWILIO_ACCOUNT_SID=your_account_sid
set TWILIO_AUTH_TOKEN=your_auth_token
set TWILIO_PHONE_NUMBER=+15074323599
set TWILIO_WHATSAPP_ENABLED=true
set TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
set TWILIO_WHATSAPP_TO_PREFIX=whatsapp:+91
```

### Option 2: IDE Configuration (For Development)

#### IntelliJ IDEA:
1. Go to Run → Edit Configurations
2. Select your Spring Boot application
3. In "Environment variables", add each variable
4. Or use "Environment variables file" to point to a .env file

#### VS Code:
1. Create a `.vscode/launch.json` file
2. Add environment variables to the configuration

### Option 3: .env File (For Local Development)

Create a `.env` file in the backend directory:
```bash
# Copy this content to .env file
DATABASE_URL=jdbc:postgresql://localhost:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15074323599
TWILIO_WHATSAPP_ENABLED=true
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO_PREFIX=whatsapp:+91
```

## Security Notes

1. **Never commit sensitive information** to version control
2. **Use strong, unique secrets** for JWT and database passwords
3. **Rotate secrets regularly** in production environments
4. **Use different secrets** for development, staging, and production
5. **Restrict access** to environment variables in production

## Verification

To verify that environment variables are working:

1. Start the application
2. Check the logs for any configuration errors
3. Test SMS/WhatsApp functionality using the test endpoints
4. Ensure database connections are working

## Troubleshooting

If environment variables are not being loaded:

1. Check the variable names match exactly (case-sensitive)
2. Ensure no extra spaces around the `=` sign
3. Restart the application after setting environment variables
4. Check that the `.env` file is in the correct location (backend directory)
