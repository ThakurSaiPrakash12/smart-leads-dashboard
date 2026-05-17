# Smart Leads Dashboard

Smart Leads Dashboard is a full-stack lead management app that combines a React UI with a TypeScript + Express API. It focuses on authenticated lead tracking, role-based access, and predictable data flows (filters, pagination, exports) while keeping the frontend and backend cleanly separated.

## Features

Core Features
- Lead CRUD with ownership checks for `SalesUser`
- Combined filters (status, source, search) with pagination and sorting
- Debounced search on the dashboard
- CSV export for admins
- Profile view and protected routes on the frontend

Security Features
- JWT auth stored in httpOnly cookies
- Role-based access control (`Admin`, `SalesUser`)
- Password hashing with bcrypt
- Rate limiting on auth routes
- Centralized validation and error responses

Scalability Features
- Pagination metadata on list endpoints
- Reusable service and middleware layers
- Shared API response format
- Indexed fields for common filters and search

## Tech Stack

Frontend
- React
- TypeScript
- TailwindCSS
- Vite

Backend
- Node.js
- Express.js
- TypeScript
- Mongoose

Database
- MongoDB

Validation
- Zod

Authentication
- JWT (httpOnly cookies)

Deployment
- Docker Compose
- Nginx (frontend container)

## Architecture Overview

The project is split into a React frontend and an Express API. The backend follows a layered approach: routes -> controllers -> services -> models, with shared middleware for auth, validation, and errors. Utilities (pagination, CSV, tokens) and constants live in dedicated modules, keeping API logic predictable and testable.

High-level structure:
```
backend/        Express + TypeScript API
frontend/       React + TypeScript UI
docker-compose.yml
```

## Backend Folder Structure

```
backend/src/
  config/       environment and database config
  constants/    enums and shared constants
  controllers/  request handlers
  interfaces/   TypeScript domain interfaces
  middleware/   auth, role, validation, error handling
  models/       Mongoose schemas
  routes/       API routes
  services/     business logic
  utils/        shared helpers (tokens, CSV, pagination)
  validators/   Zod schemas for request validation
  types/        Express type augmentation
```

This layout keeps HTTP concerns in controllers, business logic in services, and data rules in models/validators. It scales cleanly as new features and entities are added.

## API Documentation

Base URL: `/api`

Response format:
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

### Auth APIs

#### Register
- Method: `POST`
- Route: `/api/auth/register`
- Description: Create a `SalesUser` account.
- Auth: No
- Body:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```
- Query params: None
- Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "SalesUser" }
}
```

#### Login
- Method: `POST`
- Route: `/api/auth/login`
- Description: Authenticate and set auth cookie.
- Auth: No
- Body:
```json
{ "email": "jane@example.com", "password": "secret123" }
```
- Query params: None
- Response (JWT is set in cookie):
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "SalesUser" } }
}
```

#### Logout
- Method: `POST`
- Route: `/api/auth/logout`
- Description: Clear auth cookie.
- Auth: Yes
- Body: None
- Query params: None
- Response:
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

#### Me
- Method: `GET`
- Route: `/api/auth/me`
- Description: Return current user.
- Auth: Yes
- Body: None
- Query params: None
- Response:
```json
{ "success": true, "message": "User retrieved successfully", "data": { "_id": "...", "name": "...", "email": "...", "role": "..." } }
```

### Lead APIs

#### Get Leads (Paginated)
- Method: `GET`
- Route: `/api/leads`
- Description: List leads with filters, pagination, and sorting.
- Auth: Yes
- Body: None
- Query params:
  - `page` (number, default 1)
  - `status` (`New | Contacted | Qualified | Lost`)
  - `source` (`Website | Instagram | Referral`)
  - `search` (string, partial match on name/email)
  - `sort` (`latest | oldest`)
- Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      { "_id": "...", "name": "Amit Kumar", "email": "amit@test.com", "status": "New", "source": "Website", "createdBy": "...", "createdAt": "...", "updatedAt": "..." }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
  }
}
```

#### Create Lead
- Method: `POST`
- Route: `/api/leads`
- Description: Create a lead for the current user.
- Auth: Yes
- Body:
```json
{ "name": "Amit Kumar", "email": "amit@test.com", "status": "New", "source": "Website" }
```
- Query params: None
- Response:
```json
{ "success": true, "message": "Lead created successfully", "data": { "_id": "...", "name": "Amit Kumar", "email": "amit@test.com", "status": "New", "source": "Website", "createdBy": "...", "createdAt": "...", "updatedAt": "..." } }
```

#### Get Lead by ID
- Method: `GET`
- Route: `/api/leads/:id`
- Description: Fetch a single lead (ownership enforced for `SalesUser`).
- Auth: Yes
- Body: None
- Query params: None
- Response:
```json
{ "success": true, "message": "Lead retrieved successfully", "data": { "_id": "...", "name": "...", "email": "...", "status": "...", "source": "...", "createdBy": "...", "createdAt": "...", "updatedAt": "..." } }
```

#### Update Lead
- Method: `PUT`
- Route: `/api/leads/:id`
- Description: Update a lead (ownership enforced for `SalesUser`).
- Auth: Yes
- Body:
```json
{ "status": "Qualified", "source": "Referral" }
```
- Query params: None
- Response:
```json
{ "success": true, "message": "Lead updated successfully", "data": { "_id": "...", "name": "...", "email": "...", "status": "Qualified", "source": "Referral" } }
```

#### Delete Lead (Admin only)
- Method: `DELETE`
- Route: `/api/leads/:id`
- Description: Delete a lead.
- Auth: Yes (Admin)
- Body: None
- Query params: None
- Response:
```json
{ "success": true, "message": "Lead deleted successfully", "data": null }
```

#### Export Leads (Admin only)
- Method: `GET`
- Route: `/api/leads/export`
- Description: Export filtered leads as CSV.
- Auth: Yes (Admin)
- Body: None
- Query params: same as `GET /api/leads`
- Response: `text/csv` download

## Authentication Flow

JWTs are signed server-side and stored in an httpOnly cookie. The `protect` middleware validates the token, extracts the user ID and role, and attaches `req.user` for downstream handlers. `requireRole` enforces role-based access for admin-only routes. Passwords are hashed with bcrypt using `SALT_ROUNDS`.

## Validation & Error Handling

Request validation is performed with Zod schemas and the `validateRequest` middleware. Errors are normalized through `ApiError` and handled centrally in `errorMiddleware`. `asyncHandler` wraps async route handlers to avoid repetitive `try/catch` blocks.

## Database Design

### User
- Fields: `name`, `email` (unique), `password`, `role`, `createdAt`, `updatedAt`
- Passwords are hashed before save

### Lead
- Fields: `name`, `email`, `status`, `source`, `createdBy`, `createdAt`, `updatedAt`
- Relationship: `createdBy` references `User`
- Indexes: `status`, `source`, `createdBy`, and text index on `name` and `email`

### Query Strategy
- Filtering: status/source fields plus regex search on name/email
- Pagination: `skip` + `limit` using `PAGE_LIMIT`
- Sorting: `createdAt` ascending/descending

## Setup Instructions

### Clone
```bash
git clone <your-repo-url>
cd SMT
```

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build
```bash
cd backend
npm run build
npm run start
```

```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

The backend requires the following variables in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smt
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
JWT_COOKIE_NAME=smt_token
SALT_ROUNDS=10
PAGE_LIMIT=10
EXPORT_LIMIT=5000
COOKIE_MAX_AGE_DAYS=7
LOGIN_RATE_WINDOW_MIN=15
LOGIN_RATE_MAX=20
REGISTER_RATE_WINDOW_MIN=60
REGISTER_RATE_MAX=10
JSON_BODY_LIMIT=1mb
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-123
```

These `ADMIN_*` values are used by the seed script to create or update the admin account.

Frontend environment (Vite):

```env
VITE_API_URL=http://localhost:5000
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=1234567
```

## Deployment

### Docker Compose
```bash
docker compose up --build
docker compose --profile seed run --rm seed
```

The frontend container serves static assets via Nginx and proxies `/api` to the backend.

Seed credentials (Docker default):
- Email: `admin@example.com`
- Password: `change-me-123`

### Manual Deployment
- Backend: build with `npm run build`, run `node dist/server.js` behind a process manager.
- Frontend: build with `npm run build` and serve `dist/` (any static host).
- Database: MongoDB Atlas or self-hosted MongoDB.

### Render (Backend)
1. Create a new **Web Service** from the `backend` folder.
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Set environment variables from `backend/.env.example`.
5. Set `NODE_ENV=production` and `CLIENT_URL` to your Vercel URL.

### Vercel (Frontend)
1. Import the repo and select the `frontend` folder as the root.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your Render backend URL (e.g., `https://your-api.onrender.com`).
6. Optional: set `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` for prefill in the Admin login page.

## Security Practices

- bcrypt password hashing with configurable cost
- JWT stored in httpOnly cookie (`sameSite: lax`, `secure` in production)
- CORS restricted to `CLIENT_URL`
- Rate limiting on auth routes
- Helmet for HTTP hardening
- Zod validation and centralized error responses

## Scalability Decisions

- Pagination metadata and limit controls for lead lists
- Service layer to isolate business logic
- Reusable request validation
- Export limits to avoid large downloads
- Indexed fields for filters and search

## Engineering Decisions

- TypeScript for safer contracts across API and UI
- Controller/service separation to keep handlers thin
- Zod for runtime validation and clear error messages
- Centralized middleware for auth, errors, and validation
- Shared constants and interfaces for consistency

## Future Improvements

- Refresh tokens and token rotation
- Automated testing (unit + integration)
- Observability (structured logs, tracing)
- Background jobs for exports and email
- Caching for common filters
- Websocket updates for live lead changes


