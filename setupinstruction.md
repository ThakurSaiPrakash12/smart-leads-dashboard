# Smart Leads Dashboard - Setup & Deployment Guide

This guide provides step-by-step instructions for running the Smart Leads Dashboard locally and deploying it to production using Render (Backend) and Vercel (Frontend).

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local installation or MongoDB Atlas cluster)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/ThakurSaiPrakash12/smart-leads-dashboard.git
cd smart-leads-dashboard
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values, specifically the `MONGODB_URI` and `JWT_SECRET`.
   ```bash
   cp .env.example .env
   ```
4. Seed the database (optional but recommended for testing):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*

### 4. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
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
   *The frontend will run on `http://localhost:5173`*

---

## 🚀 Production Deployment Guide

### Phase 1: Deploying the Backend (Render)

1. Log in to **[Render](https://render.com/)** and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** `smart-leads-backend` (or similar)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Add the following **Environment Variables** (under Advanced):
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *<Your MongoDB Atlas Connection String>*
   - `JWT_SECRET`: *<A secure random string>*
   - `JWT_EXPIRES_IN`: `1d`
   - `JWT_COOKIE_NAME`: `gigflow_auth`
   - `CLIENT_URL`: `*` *(We will update this later once Vercel is deployed)*
   - `PORT`: `5000`
   - `SALT_ROUNDS`: `10`
   - `PAGE_LIMIT`: `10`
   - `EXPORT_LIMIT`: `1000`
   - `COOKIE_MAX_AGE_DAYS`: `1`
   - `LOGIN_RATE_WINDOW_MIN`: `15`
   - `LOGIN_RATE_MAX`: `5`
   - `REGISTER_RATE_WINDOW_MIN`: `60`
   - `REGISTER_RATE_MAX`: `3`
   - `JSON_BODY_LIMIT`: `1mb`
5. Click **Create Web Service**. Wait for it to deploy and copy the generated URL (e.g., `https://smart-leads-backend.onrender.com`).

### Phase 2: Deploying the Frontend (Vercel)

1. Log in to **[Vercel](https://vercel.com/)** and click **Add New > Project**.
2. Import the same GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select the `frontend` folder.
4. Add the following **Environment Variable**:
   - **Key:** `VITE_API_URL`
   - **Value:** *<Your Render Backend URL from Phase 1 + `/api`>* (e.g., `https://smart-leads-backend.onrender.com/api`)
5. Click **Deploy**. Wait for it to finish and copy the generated Vercel URL (e.g., `https://smart-leads-dashboard.vercel.app`).

### Phase 3: Final Security Wiring (CORS)

To ensure secure cross-origin cookies work properly, the backend must explicitly allow your frontend domain.

1. Go back to your **Render Dashboard** and open your backend service settings.
2. Go to **Environment Variables**.
3. Update the `CLIENT_URL` variable to exactly match your Vercel URL **without a trailing slash**.
   - *Example:* `https://smart-leads-dashboard.vercel.app`
4. Save the changes. Render will automatically redeploy the backend.

Once the backend finishes its restart, your full-stack application is securely connected and live!
