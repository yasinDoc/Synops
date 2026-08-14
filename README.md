# Synops — Thesis Management System

Synops is a web-based thesis management system for students, faculty, and admins. It handles proposal submission, supervision, similarity checking, defense scheduling, and final evaluation.

## Team & Branch Ownership

- Yasin - `feature/yasin-backend` - backend API, database models, similarity checker
- Tutul - `feature/tutul-frontend-dashboards` - student-facing React UI, dashboards, forms
- Mahim - `feature/mahim-faculty-notifications` - faculty-facing React UI, in-app notifications
- Saman - `feature/saman-admin-db` - admin module, DB schema, seed data
- Jishan - `feature/jishan-auth-scheduling` - auth, roles, defense scheduling, evaluation

Shared branches:
- `dev` - integration branch for current work
- `main` - demo/release-ready code

## Current Implementation

The repo now starts with a small working foundation:
- `server/` - Express API with health and thesis endpoints
- `client/` - React starter dashboard
- `database/` - place for schema and seed files

## Tech Stack

- Backend: Node.js + Express
- Frontend: React + Vite
- Database: MySQL or PostgreSQL
- Auth: JWT + role-based middleware
- Dev tools: ESLint, Prettier, GitHub Actions later

## Key Features

Student:
- Submit proposal and reports
- View similarity report and supervisor feedback
- View defense schedule and notifications

Faculty:
- Review submissions
- Comment, approve, reject, or request revision
- View assigned students and defense schedules

Admin:
- Manage users, departments, semesters, and deadlines
- Assign supervisors and board members
- Schedule defenses and generate reports

## Suggested Database Tables

- users, students, faculty, departments, theses, proposals, submissions, files, similarity_reports, comments, defense_schedules, board_members, evaluations, notifications

## Folder Structure

```
Synops/
├─ README.md
├─ .gitignore
├─ client/ (React)
├─ server/ (Node/Express)
├─ database/ (migrations, seeders)
└─ docs/
```

## Getting Started

Prereqs: Node.js 16+, npm, Git, and MySQL/PostgreSQL.

Backend:
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Frontend:
```bash
cd client
npm install
npm run dev
```

Database example:
```bash
mysql -u root -p -e "CREATE DATABASE synops;"
mysql -u root -p synops < database/schema.sql
```

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=synops
JWT_SECRET=change_this
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=20
REACT_APP_API_URL=http://localhost:5000/api
```

## Branching & Git Workflow

Create a branch from `dev`:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-branch-name
```

Save and push:
```bash
git add .
git commit -m "feat(area): short description"
git push -u origin feature/your-branch-name
```

Open a Pull Request to `dev`. After review, merge `dev` into `main` for demo.

Keep your branch up to date:
```bash
git fetch origin
git checkout dev
git pull origin dev
git checkout feature/your-branch-name
git merge dev
```

## Commit Messages

Use short Conventional-style messages:
- `feat: add proposal form`
- `fix: correct similarity calculation`
- `docs: update README`

## PR Checklist

- Branch is up to date with `dev`
- Tests added or updated
- Lint passes
- DB migrations included if schema changed
- `.env.example` updated if needed
- At least one reviewer assigned

## Milestones

- Week 1-2: finalize stack, DB schema, repo setup, role split
- Week 3-4: auth + dashboard skeleton
- Week 5-6: student submission + repository
- Week 7-8: faculty review flows
- Week 9: similarity module
- Week 10: admin + scheduling
- Week 11: evaluation + notifications
- Week 12: testing + demo

## Open Questions

- Confirm final DB engine: MySQL or Postgres
- Decide file storage: local or S3
- Decide similarity scope: internal repo only or web sources

## Sprint Execution Plan

For the current 2–3 week build, follow [TEAM_TASKS.md](TEAM_TASKS.md) instead of the long-term feature list. It keeps the project small enough to demo:

- fake the similarity checker
- skip email verification and forgot password
- use one department only
- keep notifications in-app only
- focus on the core loop: proposal → review → submission → similarity → defense → evaluation

