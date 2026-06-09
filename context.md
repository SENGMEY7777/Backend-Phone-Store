# Frontend generation context for Backend-Phone-Store

Purpose
- Machine- and developer-readable summary describing the backend API, authentication flow, data models, environment, and recommended frontend scaffolding. Use this to automatically generate a React/Vite frontend (or other stacks).

Project summary
- Backend: Node.js + Express API (entry: `app.js`).
- DB: MySQL; schema and initial data in `sql/schema.sql`.
- API base: `/api` (server default port `3000` in development).

Auth & session
- Routes mounted in `app.js`:
  - `/api/auth/users` — user auth routes
  - `/api/auth/admin` — admin auth routes
- Token: JWT issued on login and stored in DB `token` column. Login endpoint returns user data; token is expected to be included in protected requests using header `Authorization: Bearer <TOKEN>`.
- Typical flow:
  1. POST `/api/auth/users/register` with JSON `{ name, email, password_hash }` → sends verification email and creates user.
  2. User clicks verification link: GET `/api/auth/users/verify-email?token=...` → sets `is_verified` and `is_active`.
  3. POST `/api/auth/users/login` with JSON `{ email, password_hash }` → returns JWT and user row.

Key API endpoints (minimal set for frontend)
- POST `/api/auth/users/register` — body: `{ name, email, password_hash }`
- POST `/api/auth/users/login` — body: `{ email, password_hash }`
- GET `/api/auth/users/verify-email?token=` — query param `token`
- GET `/api/user/products` — list products (check `routes/users/productRoute.js` for filters)
- GET `/api/user/products/:id` — product detail
- GET `/api/user/brands` — brand list
- POST `/api/user/orders` — create order (protected)

Data shapes (examples)
- User (returned fields): `id, full_name, email, role, token, is_verified, is_active, created_at`
- Product (partial): `id, brand_id, name, description, price, stock_quantity, image_url, is_active`
- Brand (partial): `id, name, description`

Frontend stack recommendation
- Preferred: React + Vite (fast scaffold). Alternatives: Next.js (SSR), Vue, Svelte.
- Dev proxy: configure Vite `server.proxy` to forward `/api` to `http://localhost:3000` so code can call relative `/api/*`.

Scaffold and dev commands (React+Vite)
1. From project root:
   - `npm create vite@latest frontend -- --template react`
2. Install deps inside `frontend`:
   - `cd frontend && npm install && npm install axios`
3. Add `vite.config.js` dev proxy:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: { proxy: { '/api': 'http://localhost:3000' } }
   })
   ```
4. Start frontend: `npm run dev`

Frontend structure suggestions
- `src/api.js` — axios instance: `baseURL: '/api'` and interceptor to attach `Authorization` Bearer token from localStorage.
- `src/pages/Register.jsx`, `Login.jsx`, `VerifyEmail.jsx`, `Dashboard.jsx`, `ProductsList.jsx`, `ProductDetail.jsx`.
- `src/components/AuthForm.jsx`, `NavBar.jsx`, `ProtectedRoute.jsx`.

UI behavior & validations
- `Register` form fields: `name`, `email`, `password` (send as `password_hash` to match backend naming).
- `Login` form fields: `email`, `password` (send as `password_hash`).
- On successful login store JWT in `localStorage` under `auth_token` and include `Authorization` header for subsequent requests.
- Display server `message` and handle `success` boolean from responses.

Deployment notes
- For production you can build the frontend (`npm run build`) and serve static files from Express (e.g., copy `frontend/dist` to backend `public` and use `express.static`).

Developer automation hints for codegen agents
- Use this file as the canonical context for generating frontend components, API client code, routing, and basic styles.
- Ensure generated network calls match endpoints above and send/expect JSON.
- Respect CORS and proxy approach in development; use `localStorage` for tokens and `Authorization: Bearer` header.
