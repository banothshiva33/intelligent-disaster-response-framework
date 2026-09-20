# RAAVA Backend

This is the Express + TypeScript backend for the Intelligent Disaster Response Framework.

## Stack
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT-based auth and RBAC
- File upload support for evidence
- Volunteer ranking and assignment engine
- Notification and GIS dashboard endpoints
- Fallback AI severity prediction service

## Getting started
1. Copy `.env.example` to `.env` and set your database and secret values.
2. Install dependencies with `npm install`.
3. Run the app in development mode with `npm run dev`.
4. Build with `npm run build`.
5. Start the compiled server with `npm start`.

## Core API groups
- `/api/auth` – registration, login, profile
- `/api/incidents` – incident creation and listing
- `/api/evidence` – upload and retrieval of evidence
- `/api/verification` – confirmation and reviewer decisions
- `/api/volunteers` – volunteer profile and roster endpoints
- `/api/incidents/:incidentId/volunteers` – ranked volunteers for an incident
- `/api/assignments` – assignment creation and volunteer response
- `/api/notifications` – user notification inbox
- `/api/dashboard` – operational overview and GIS map data
- `/api/ai` – severity prediction endpoint
- `/api/seed` – demo data initialization

## Demo seed
Use the seed endpoint to populate the database with sample users, volunteers, and an incident during local development.

## Notes
This backend is designed to sit behind the existing RAAVA frontend without replacing the UI, maintaining compatibility with the current interface and behavior.
