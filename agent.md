# Project Agent: Backend-Phone-Store

Purpose
- Provide a concise reference for an automation agent or developer working on this repository.

Overview
- Backend: Node.js + Express API (entry: `app.js`).
- Database: MySQL (schema in `sql/schema.sql`).
- Frontend: not yet included — recommended `frontend` (React + Vite) scaffold.

Quick run (Docker, recommended)
- Start services:
  - `docker-compose up --build -d`
- Follow logs:
  - `docker-compose logs -f app`
- Reset DB (destructive):
  - `docker-compose down -v && docker-compose up --build -d`

Run locally (without Docker)
- Install deps: `npm ci`
- Ensure a MySQL instance exists and import `sql/schema.sql`.
- Export env vars (or create `.env`) matching `docker-compose.yml` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`).
- Start: `npm start`

Important files
- `app.js` — server entry and route mounts
- `routes/users/userRoutes.js` — user auth routes (mounted at `/api/auth/users`)
- `controllers/users/userController.js` — handler implementations
- `services/users/userService.js` — business logic
- `models/users/userModel.js` — DB queries (uses `configs/db` pool)
- `sql/schema.sql` — DB schema & init data

Useful endpoints
- POST `/api/auth/users/register` — body: `{ name, email, password_hash }`
- POST `/api/auth/users/login` — body: `{ email, password_hash }`
- GET `/api/auth/users/verify-email?token=...` — email verification

Developer notes / troubleshooting
- If you see SQL errors about missing columns, re-run the schema or ALTER the table to add columns used by the models (`verification_token`, `verification_expires`, etc.).
- The `docker-compose.yml` mounts `./sql/schema.sql` to the DB init folder — the DB only runs this on first initialization of the volume. To force re-run, remove the `db_data` volume.
- The app uses `PORT` and DB env vars from environment — ensure they match when running locally.

Frontend (recommended quick start)
- Scaffold React + Vite in `frontend/` and add a dev proxy to `http://localhost:3000` so relative `/api` calls hit the backend.

Agent actions (examples)
- run tests (if added), run DB migrations, seed sample data, call auth endpoints, create scaffold frontend, or generate Postman collection from `routes`.

Contact / next steps
- To scaffold the frontend and add Register/Login pages, run the recommended Vite scaffold steps or ask the agent to create them automatically.
