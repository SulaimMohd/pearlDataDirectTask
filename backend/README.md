# PearlData Backend

A simple Spring Boot REST API for user management.

## Prerequisites

- Java 17 or higher
- PostgreSQL database
- Maven (or use the included Maven wrapper)

## Database Setup

1. Install PostgreSQL
2. Create a database named `fullstack_db`
3. Update the database credentials in `src/main/resources/application.yml` if needed

## Running the Application

### Using Maven Wrapper (Recommended)
```bash
./mvnw spring-boot:run
```

### Using Maven (if installed)
```bash
mvn spring-boot:run
```

The application will start at `http://localhost:8080/api`

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/search?q={query}` - Search users
- `GET /api/users/email/{email}` - Get user by email

## Health Check

- Health endpoint: `http://localhost:8080/api/actuator/health`

## Example User JSON

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software Developer"
}
```
