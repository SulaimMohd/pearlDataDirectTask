# PearlData Full Stack Application

A comprehensive full-stack web application built with React, Spring Boot, and PostgreSQL, featuring role-based access control, real-time notifications, event management, and a beautiful glass-morphism design.

## ⚠️ IMPORTANT: Initial Setup Required

**Before running the application, you MUST create an admin user in your local PostgreSQL database:**

```sql
-- Connect to your PostgreSQL database
psql -U postgres -d fullstack_db

-- Insert the default admin user
INSERT INTO users (name, email, password, role, phone_number, bio, is_active, created_at, updated_at) 
VALUES (
    'Admin User', 
    'admin@example.com', 
    'your_passowrd', 
    'ADMIN', 
    '+91yournumber', 
    'System Administrator', 
    true, 
    NOW(), 
    NOW()
);
```

**Password for admin@example.com is: `admin123`**

This admin user is required to:
- Access the admin panel
- Create other users (Faculty, Students, Admins)
- Manage the system

Without this initial admin user, you won't be able to log in or create other users!

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with bcrypt password encryption
- **Role-Based Access Control (RBAC)** - Admin, Faculty, Student roles
- **Protected Routes** - Role-specific access to different sections
- **Admin-only User Creation** - Users are created by administrators only

### 👥 User Management
- **Complete CRUD Operations** for users with role-based permissions
- **Real-time Search** with instant filtering
- **User Profile Management** with detailed information
- **Role-specific Dashboards** for Admin, Faculty, and Student

### 📚 Academic Management
- **Event Management** - Create, schedule, and manage academic events
- **Attendance Tracking** - Mark and track student attendance
- **Student Progress** - Monitor academic performance and statistics
- **Analytics Dashboard** - Comprehensive insights for faculty

### 🔔 Notification System
- **Real-time Notifications** - In-app notifications for events and attendance
- **SMS & WhatsApp Integration** - Twilio-powered messaging system
- **Notification Management** - Mark as read, delete, and filter notifications

### 🎨 Modern UI/UX
- **Glass-morphism Design** with vibrant color palette
- **Responsive Design** - Works seamlessly on all devices
- **Smooth Animations** - Enhanced user experience with transitions
- **Dark/Light Theme Support** - Beautiful gradient backgrounds

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for modern icons
- **React Context** for state management

### Backend
- **Spring Boot 3.2.0** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate ORM
- **PostgreSQL** for data persistence
- **Maven** for dependency management
- **Twilio SDK** for SMS and WhatsApp messaging

### Database
- **PostgreSQL** for production data
- **JPA/Hibernate** for ORM
- **Database Migrations** with automatic schema updates

## 📁 Project Structure

```
PearlDataDirectTask/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   ├── Layout.tsx            # Main layout component
│   │   │   ├── AdminLayout.tsx       # Admin-specific layout
│   │   │   ├── FacultyLayout.tsx     # Faculty-specific layout
│   │   │   ├── StudentLayout.tsx     # Student-specific layout
│   │   │   └── ProtectedRoute.tsx    # Route protection
│   │   ├── context/                  # React Context for state management
│   │   │   ├── AuthContext.tsx       # Authentication state
│   │   │   ├── UserContext.tsx       # User management state
│   │   │   ├── AdminContext.tsx      # Admin-specific state
│   │   │   ├── FacultyContext.tsx    # Faculty-specific state
│   │   │   ├── StudentContext.tsx    # Student-specific state
│   │   │   └── ToastContext.tsx      # Notification toasts
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── admin/                # Admin pages
│   │   │   ├── faculty/              # Faculty pages
│   │   │   └── student/              # Student pages
│   │   ├── App.tsx                   # Main App component
│   │   └── main.tsx                  # Application entry point
│   ├── package.json
│   └── tailwind.config.js            # Tailwind CSS configuration
├── backend/                          # Spring Boot backend application
│   ├── src/main/java/com/pearldata/
│   │   ├── entity/                   # JPA entities
│   │   │   ├── User.java            # User entity
│   │   │   ├── Student.java         # Student entity
│   │   │   ├── Event.java           # Event entity
│   │   │   ├── Attendance.java      # Attendance entity
│   │   │   └── Notification.java    # Notification entity
│   │   ├── repository/               # Data repositories
│   │   ├── service/                  # Business logic layer
│   │   ├── controller/               # REST controllers
│   │   │   ├── AuthController.java  # Authentication endpoints
│   │   │   ├── AdminController.java # Admin-specific endpoints
│   │   │   ├── FacultyController.java # Faculty-specific endpoints
│   │   │   ├── StudentController.java # Student-specific endpoints
│   │   │   └── NotificationController.java # Notification endpoints
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── config/                   # Configuration classes
│   │   └── FullstackAppApplication.java
│   ├── src/main/resources/
│   │   └── application.yml           # Application configuration
│   └── pom.xml                       # Maven dependencies
├── ENVIRONMENT_SETUP.md              # Environment variables setup
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PearlDataDirectTask
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` or download from [postgresql.org](https://www.postgresql.org/download/macosx/)
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

#### Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE fullstack_db;

-- Create user (optional)
CREATE USER fullstack_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fullstack_db TO fullstack_user;
```

### 3. Environment Variables Setup

Create a `.env` file in the backend directory or set environment variables:

```bash
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/fullstack_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRATION=86400000

# Twilio Configuration (Optional - for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_ENABLED=true
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO_PREFIX=whatsapp:+91
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and run
./mvnw spring-boot:run

# Or using Maven directly
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔐 Default Credentials

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Faculty User
- **Email**: `faculty@example.com`
- **Password**: `faculty123`
- **Role**: FACULTY

### Student User
- **Email**: `sulaimmohd77@gmail.com`
- **Password**: `123456`
- **Role**: STUDENT

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin Endpoints
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/student` - Create student
- `POST /api/admin/users/faculty` - Create faculty
- `POST /api/admin/users/admin` - Create admin
- `GET /api/admin/users/search` - Search users

### Faculty Endpoints
- `GET /api/faculty/dashboard-stats` - Faculty dashboard
- `GET /api/faculty/students` - Get all students
- `GET /api/faculty/events` - Get faculty events
- `POST /api/faculty/events` - Create event
- `GET /api/faculty/attendance` - Get attendance records
- `POST /api/faculty/attendance/mark` - Mark attendance
- `GET /api/faculty/analytics` - Get analytics data

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `GET /api/student/dashboard-stats` - Student dashboard
- `GET /api/student/events` - Get all events
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/progress` - Get progress data
- `GET /api/student/notifications` - Get notifications
- `PUT /api/student/notifications/{id}/read` - Mark notification as read

### Notification Endpoints
- `GET /api/student/notifications` - Get all notifications
- `GET /api/student/notifications/recent` - Get recent notifications
- `GET /api/student/notifications/count` - Get unread count
- `PUT /api/student/notifications/{id}/read` - Mark as read
- `DELETE /api/student/notifications/{id}` - Delete notification

## 🎨 Design System

### Color Palette
- **Primary**: Pink gradients (`#ec4899` to `#f472b6`)
- **Secondary**: Orange gradients (`#f2740a` to `#f59633`)
- **Accent**: Purple gradients (`#8b5cf6` to `#7c3aed`)
- **Success**: Green gradients (`#10b981` to `#059669`)
- **Warning**: Yellow gradients (`#f59e0b` to `#d97706`)
- **Error**: Red gradients (`#ef4444` to `#dc2626`)

### Glass-morphism Effects
- **Backdrop Blur**: `backdrop-blur-sm`
- **Transparency**: `bg-white/10` to `bg-white/50`
- **Borders**: `border-white/20`
- **Shadows**: `shadow-lg` with `shadow-xl` on hover

### Typography
- **Headings**: `font-bold` with gradient text
- **Body**: `text-gray-700` with `leading-relaxed`
- **Captions**: `text-gray-500` with `text-sm`

## 🔧 Development

### Backend Development
- **Hot Reloading**: Spring Boot DevTools enabled
- **Database Console**: H2 console available at `/h2-console` (if enabled)
- **Health Check**: Actuator endpoints at `/actuator/health`
- **API Documentation**: Available at `/swagger-ui.html` (if enabled)

### Frontend Development
- **Hot Module Replacement**: Vite provides fast HMR
- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first CSS framework

### Database Development
- **JPA/Hibernate**: Automatic schema generation
- **Database Migrations**: `ddl-auto: update`
- **Connection Pooling**: HikariCP for optimal performance

## 🚀 Deployment

### Backend Deployment
```bash
# Build JAR file
./mvnw clean package

# Run JAR file
java -jar target/fullstack-app-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

### Environment Variables for Production
Make sure to set all required environment variables in your production environment:
- Database credentials
- JWT secret key
- Twilio credentials (if using SMS/WhatsApp)

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest
```

### Frontend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📱 Features by Role

### Admin Features
- ✅ **User Management** - Create, read, update, delete users
- ✅ **Dashboard Statistics** - Overview of system metrics
- ✅ **User Search** - Advanced search and filtering
- ✅ **Role Management** - Assign roles to users
- ✅ **System Overview** - Monitor all activities

### Faculty Features
- ✅ **Event Management** - Create and manage academic events
- ✅ **Student Management** - View and manage student information
- ✅ **Attendance Tracking** - Mark and track student attendance
- ✅ **Analytics Dashboard** - Student performance insights
- ✅ **Notification System** - Send notifications to students

### Student Features
- ✅ **Personal Dashboard** - Academic overview and statistics
- ✅ **Event Calendar** - View scheduled events
- ✅ **Attendance Records** - Track attendance history
- ✅ **Progress Tracking** - Monitor academic progress
- ✅ **Notifications** - Receive and manage notifications
- ✅ **Library Management** - Track borrowed books

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt hashing for passwords
- **Role-Based Access Control** - Granular permission system
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - JPA/Hibernate parameterized queries

## 📞 Support & Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Environment Variables Not Loading
- Ensure `.env` file is in the backend directory
- Check environment variable names match exactly
- Restart the backend application after changes

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Environment Setup Guide](ENVIRONMENT_SETUP.md)
- Contact the development team

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Project Status

- ✅ **Authentication System** - Complete
- ✅ **User Management** - Complete
- ✅ **Role-Based Access Control** - Complete
- ✅ **Event Management** - Complete
- ✅ **Attendance Tracking** - Complete
- ✅ **Notification System** - Complete
- ✅ **SMS/WhatsApp Integration** - Complete
- ✅ **Responsive Design** - Complete
- ✅ **Database Integration** - Complete
- 🔄 **Testing Coverage** - In Progress
- 🔄 **Documentation** - In Progress

## 🎯 Roadmap

- [ ] **Email Notifications** - SMTP integration
- [ ] **File Upload** - Profile pictures and documents
- [ ] **Advanced Analytics** - Detailed reporting
- [ ] **Mobile App** - React Native version
- [ ] **API Rate Limiting** - Enhanced security
- [ ] **Audit Logging** - Activity tracking
- [ ] **Multi-language Support** - Internationalization

---

**Built with ❤️ using React, Spring Boot, and PostgreSQL**
