# PearlData Full Stack Application

A modern full-stack web application built with React, Spring Boot, and PostgreSQL, featuring a beautiful glass-morphism design.

## 🚀 Features

- **Modern UI/UX**: Glass-morphism design with vibrant color palette
- **User Management**: Complete CRUD operations for users
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Search**: Instant user search functionality
- **Type Safety**: Built with TypeScript for better development experience
- **Modern Stack**: Latest versions of React, Spring Boot, and PostgreSQL

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Spring Boot 3.2.0**
- **Java 17**
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Spring Web** for REST APIs
- **Spring Validation** for data validation

### Database
- **PostgreSQL** for data persistence

## 📁 Project Structure

```
PearlDataDirectTask/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React Context for state management
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── tailwind.config.js  # Tailwind CSS configuration
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/com/pearldata/
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST controllers
│   │   └── FullstackAppApplication.java
│   ├── src/main/resources/
│   │   └── application.yml # Application configuration
│   └── pom.xml             # Maven dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher

### Database Setup

1. Install PostgreSQL on your system
2. Create a database named `fullstack_db`
3. Update the database credentials in `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fullstack_db
    username: your_username
    password: your_password
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📚 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/search?q={query}` - Search users
- `GET /api/users/email/{email}` - Get user by email

### Request/Response Examples

#### Create User
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software Developer"
}
```

#### Update User
```json
PUT /api/users/{id}
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "bio": "Senior Software Developer"
}
```

## 🎨 Design System

The application uses a modern glass-morphism design with:

- **Primary Colors**: Pink gradients (#ec4899 to #f472b6)
- **Secondary Colors**: Orange gradients (#f2740a to #f59633)
- **Accent Colors**: Purple gradients (#8b5cf6 to #7c3aed)
- **Glass Effects**: Backdrop blur with transparency
- **Animations**: Smooth transitions and hover effects

## 🔧 Development

### Backend Development
- Uses Spring Boot DevTools for hot reloading
- H2 console available at `/h2-console` (if enabled)
- Actuator endpoints at `/actuator/health`

### Frontend Development
- Vite provides fast HMR (Hot Module Replacement)
- Tailwind CSS for utility-first styling
- TypeScript for type safety

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support or questions, please open an issue in the repository.
