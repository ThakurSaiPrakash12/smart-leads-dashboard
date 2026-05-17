# Smart Leads API Documentation

This document covers API usage plus setup instructions for local and Docker environments.

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm 9+
- MongoDB 7+
- Docker (optional, for containerized setup)

### Environment Variables
Create `backend/.env` from `backend/.env.example` and update the values.

Required variables (from runtime validation):
- `PORT`: API port (number)
- `NODE_ENV`: `development` or `production`
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign JWTs
- `JWT_EXPIRES_IN`: JWT expiry (e.g., `7d`)
- `CLIENT_URL`: frontend origin allowed for CORS
- `JWT_COOKIE_NAME`: cookie name for auth token
- `SALT_ROUNDS`: bcrypt cost factor (number)
- `PAGE_LIMIT`: default pagination limit (number)
- `EXPORT_LIMIT`: max export rows (number)
- `COOKIE_MAX_AGE_DAYS`: auth cookie lifetime in days (number)
- `LOGIN_RATE_WINDOW_MIN`: login rate window minutes (number)
- `LOGIN_RATE_MAX`: login max attempts (number)
- `REGISTER_RATE_WINDOW_MIN`: register rate window minutes (number)
- `REGISTER_RATE_MAX`: register max attempts (number)
- `JSON_BODY_LIMIT`: JSON body size limit (e.g., `1mb`)

### Local Development
Backend:
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Seed Data (Local)
```bash
cd backend
npm run seed
```

Notes:
- The seed script uses `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `backend/.env`.

### Docker
```bash
docker compose up --build
docker compose --profile seed run --rm seed
```

Open `http://localhost:5173`.

## API Overview

### Base URL
All endpoints are under `/api`.

### Auth Model
- Auth uses an httpOnly cookie named by `JWT_COOKIE_NAME`.
- The token is not returned in the response body.
- The frontend must send cookies (`withCredentials: true`).

### Response Shapes
Success:
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Paginated:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email: Invalid email"]
}
```

### Status Codes
- `200` OK
- `201` Created
- `400` Validation errors
- `401` Not authenticated
- `403` Not authorized (role)
- `404` Not found
- `409` Conflict (email already registered)

### Enums
Lead status:
- `New`
- `Contacted`
- `Qualified`
- `Lost`

Lead source:
- `Website`
- `Instagram`
- `Referral`

User roles:
- `Admin`
- `SalesUser`

## Auth Endpoints

### Register
`POST /api/auth/register`

Body:
```json
{ "name": "", "email": "", "password": "" }
```

Response:
```json
{ "success": true, "message": "Account created successfully", "data": { "_id": "...", "name": "...", "email": "...", "role": "SalesUser" } }
```

### Login
`POST /api/auth/login`

Body:
```json
{ "email": "", "password": "" }
```

Response (token set in cookie):
```json
{ "success": true, "message": "Login successful", "data": { "user": { "_id": "...", "name": "...", "email": "...", "role": "SalesUser" } } }
```

### Logout
`POST /api/auth/logout`

Response:
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

### Me
`GET /api/auth/me`

Response:
```json
{ "success": true, "message": "User retrieved successfully", "data": { "_id": "...", "name": "...", "email": "...", "role": "..." } }
```

## Leads Endpoints

All leads endpoints require authentication.

### Get Leads (Paginated)
`GET /api/leads`

Query params:
- `page`: number (default 1)
- `status`: `New | Contacted | Qualified | Lost`
- `source`: `Website | Instagram | Referral`
- `search`: string (partial match on name or email)
- `sort`: `latest | oldest`

Response: paginated lead list.

### Create Lead
`POST /api/leads`

Body:
```json
{ "name": "", "email": "", "status": "New", "source": "Website" }
```

Response: created lead.

### Get Lead by ID
`GET /api/leads/:id`

Response: lead.

### Update Lead
`PUT /api/leads/:id`

Body: partial of create lead.

Response: updated lead.

### Delete Lead (Admin only)
`DELETE /api/leads/:id`

Response: `{ success: true, message: "Lead deleted successfully", data: null }`.

### Export Leads (Admin only)
`GET /api/leads/export`

Query params: same as `GET /api/leads`.

Response: `text/csv` file download.

## Notes for Clients
- Always send cookies on authenticated requests.
- Use the pagination metadata to build page controls.
- When filtering, reset `page` to `1` for new filter sets.
