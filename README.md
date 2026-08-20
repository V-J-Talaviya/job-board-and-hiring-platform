# Job Board & Hiring Platform

A full-stack job board where **candidates** search and apply, **recruiters** post jobs and manage a hiring pipeline, and **admins** oversee users, listings, and platform metrics.

The repo is a small TypeScript monorepo: an Express + MongoDB API (`server/`) and a React + Vite SPA (`client/`).

---

## Features

| Role          | What they can do                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Candidate** | Browse/filter jobs, bookmark listings, upload a resume, apply with a cover letter, track application status           |
| **Recruiter** | Create/edit jobs, open or close listings, soft-delete jobs, review applicants, move applications through the pipeline |
| **Admin**     | Dashboard with time-range charts, list/filter all users/jobs/applications, suspend or reactivate users                |
| **Public**    | Home page, job search, job detail, register as candidate or recruiter, login                                          |

Pipeline statuses: `APPLIED` → `SHORTLISTED` → `INTERVIEWED` → `HIRED` (or `REJECTED` at any point).

---

## Architecture at a glance

```
┌─────────────┐        HTTPS/JSON        ┌──────────────────┐        Mongoose        ┌───────────┐
│  React SPA  │  ─────────────────────►  │  Express API     │  ──────────────────►   │  MongoDB  │
│  (Vite)     │  ◄─────────────────────  │  (/api/v1)       │  ◄──────────────────   │           │
└─────────────┘                          └──────────────────┘                        └───────────┘
                                                   │
                                                   ▼
                                          local filesystem
                                          (server/uploads/resumes)
```

**Server** is a modular monolith: each domain (`auth`, `users`, `jobs`, `applications`, `bookmarks`, `dashboards`, `admin`) owns its routes, controller, service, validators, and (where needed) Mongoose model.

**Client** is organized by feature and role: API clients, Zod form schemas, shared UI, and role-gated routes under `/candidate`, `/recruiter`, and `/admin`.

---

## Prerequisites

- **Node.js 20+** and npm
- **MongoDB 6+** running locally (or a connection string to Atlas / another host)

---

## Setup

From the repository root:

```bash
# 1. Install root, server, and client dependencies
npm run install:all

# 2. Server environment (dotenv loads from server/ when you use the npm scripts)
cp .env.example server/.env

# 3. Client environment
cp client/.env.example client/.env
```

Edit `server/.env` if your MongoDB URI, ports, or admin seed credentials differ from the defaults.

Then prepare the database and start both apps:

```bash
# Create indexes and backfill job fields
npm run db:migrate

# Optional: demo users, jobs, applications, bookmarks
npm run db:seed

# API (http://localhost:5000) + SPA (http://localhost:5173)
npm run dev
```

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

A successful response looks like `{ "success": true, "data": { "status": "healthy", "database": "connected" } }`.

### Useful scripts

| Command                                     | What it does                                        |
| ------------------------------------------- | --------------------------------------------------- |
| `npm run dev`                               | Runs API and SPA together via `concurrently`        |
| `npm run server:dev` / `npm run client:dev` | Run one side only                                   |
| `npm run build`                             | Compile server (`tsc`) and client (`tsc` + Vite)    |
| `npm run db:migrate`                        | Apply pending Mongo migrations                      |
| `npm run db:seed`                           | Idempotent demo data (skips existing emails / jobs) |

---

## Environment variables

### Server (`server/.env`)

Copied from the root `[.env.example](.env.example)`. `dotenv` is loaded from the **server working directory**, so this file must live at `server/.env` (not the repo root) when you use `npm run server:dev` / `db:migrate` / `db:seed`.

| Variable             | Required | Default                               | Purpose                                                                                                                                                             |
| -------------------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`           | no       | `development`                         | `development` / `production` / `test`. Controls Morgan log format and whether 500 responses include a stack trace. Request logging is skipped when `NODE_ENV=test`. |
| `PORT`               | yes      | `5000`                                | HTTP port for the API                                                                                                                                               |
| `MONGODB_URI`        | yes      | `mongodb://localhost:27017/job_board` | Mongo connection string. Startup no-ops if this is empty.                                                                                                           |
| `JWT_SECRET`         | yes      | empty string                          | HMAC secret for access tokens. **Change this** before any shared or production use.                                                                                 |
| `JWT_EXPIRES_IN`     | no       | `1d`                                  | Token lifetime passed to `jsonwebtoken` (`1d`, `12h`, seconds, etc.)                                                                                                |
| `CLIENT_URL`         | no       | `http://localhost:5173`               | Allowed CORS origin (`credentials: true`)                                                                                                                           |
| `UPLOAD_DIR`         | no       | `uploads/resumes`                     | Disk folder for resume files (relative to the server cwd)                                                                                                           |
| `MAX_RESUME_SIZE_MB` | no       | `5`                                   | Multer file-size limit                                                                                                                                              |
| `ADMIN_NAME`         | seed     | `System Admin`                        | Display name for the seeded admin                                                                                                                                   |
| `ADMIN_EMAIL`        | seed     | `admin@example.com`                   | Seeded admin login; also used to skip re-creating the admin                                                                                                         |
| `ADMIN_PASSWORD`     | seed     | `Admin@12345`                         | Seeded admin password (bcrypt-hashed at insert time)                                                                                                                |

### Client (`client/.env`)

Copied from `[client/.env.example](client/.env.example)`. Vite only exposes variables prefixed with `VITE_`.

| Variable       | Required | Default                        | Purpose                                                                                     |
| -------------- | -------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | no       | `http://localhost:5000/api/v1` | Axios `baseURL`. Must include the `/api/v1` prefix. Rebuild/restart Vite after changing it. |

---

## Demo accounts

Created by `npm run db:seed` (passwords are printed at the end of the seed run):

| Role      | Email                                                | Password                                          |
| --------- | ---------------------------------------------------- | ------------------------------------------------- |
| Admin     | value of `ADMIN_EMAIL` (default `admin@example.com`) | value of `ADMIN_PASSWORD` (default `Admin@12345`) |
| Recruiter | `recruiter1@example.com`                             | `Recruiter@123`                                   |
| Candidate | `candidate1@example.com`                             | `Candidate@123`                                   |

Additional recruiters (`recruiter2@example.com`) and candidates (`candidate2`–`candidate5@example.com`) use the same role passwords. Seed is idempotent: existing users/jobs/applications are left in place.

Registering through the UI only allows **CANDIDATE** or **RECRUITER**. Admins are created via seed (or directly in MongoDB).

---

## Project structure

```
job-board/
├── package.json              # install:all, dev, build, db scripts
├── .env.example              # server env template
├── client/                   # React 18 + Vite 7 + Tailwind
│   ├── src/
│   │   ├── app/              # AuthProvider, QueryProvider, route guards
│   │   ├── pages/            # public + role-specific pages
│   │   ├── features/         # jobs / applications UI pieces
│   │   ├── services/         # Axios API clients
│   │   ├── validations/      # Zod schemas for forms
│   │   └── components/       # shared layout and UI
│   └── .env.example
└── server/
    ├── src/
    │   ├── server.ts         # connect DB, listen
    │   ├── app.ts            # helmet, cors, json, routes, errors
    │   ├── config/           # env + mongoose
    │   ├── middleware/       # auth, RBAC, zod, multer, rate limit
    │   ├── modules/          # one folder per domain
    │   ├── routes/index.ts   # /api/v1 mount + /health
    │   ├── database/         # custom migrations + seed
    │   └── shared/           # AppError, JWT, pagination, enums
    └── uploads/resumes/      # local resume files (gitignored)
```
