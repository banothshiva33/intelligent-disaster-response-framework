# RAAVA Backend

This backend is implemented in Java and Spring Boot, replacing the previous Node.js/Express implementation.

## Stack
- Java 21
- Spring Boot 3.3.x
- Spring Web
- Spring Data MongoDB
- Spring Security
- JWT authentication
- BCrypt password hashing
- Python-based AI/ML service for severity inference

## Architecture
Frontend -> Spring Boot -> Verified Incident -> Python FastAPI ML -> Volunteer allocation -> Assignment/Notification

## Folder structure
backend/
├── src/
│   ├── main/
│   │   ├── java/com/raava/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── .env.example
├── pom.xml
└── README.md

## Environment variables
Copy `.env.example` to `.env` and configure values before running locally.

Required values:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `ML_SERVICE_URL`
- `PORT`

## Run locally
```bash
mvn clean install
mvn spring-boot:run
```

## Health endpoint
```bash
curl http://localhost:8080/api/health
```

## Key API groups
- `/api/auth` - registration, login, profile
- `/api/incidents` - incident creation and retrieval
- `/api/verification` - confirmation and review flow
- `/api/volunteers` - volunteer profiles and verification
- `/api/allocation` - ranking using 50/30/20 weighting
- `/api/assignments` - assignment creation and response
- `/api/notifications` - read/unread notification handling
- `/api/dashboard` - operational overview data
- `/api/ai` - severity prediction integration

## Python ML service
The AI/ML logic is intentionally kept in the Python FastAPI service under `ai-ml/`.

## Notes
The previous Node.js/Express backend is not used. This repository now uses Spring Boot as the application backend and MongoDB as the persistence layer.
