# Synops — Features & Branch Assignments

One document, one place: what is being built, who is building it, and which branch it lives on. This is the trimmed sprint scope, not the full README version.

## How to use this

1. Find your name below.
2. `git checkout <your-branch>`.
3. Work through your checklist top to bottom.
4. Open a PR into `dev` when a chunk is done.
5. Update the checkboxes or post progress in the group chat.

Golden rule: do not build ahead of what's connected. Working end-to-end matters more than polish.

## Build order

1. Saman - schema first.
2. Jishan - auth next.
3. Yasin + Saman - backend APIs in parallel once schema and auth exist.
4. Tutul - UI in parallel using mock data, then swap to real endpoints.
5. Merge everyone into `dev`, test the full loop, then `dev` to `main` for the demo.

## Yasin - `feature/yasin-backend-similarity`

Owns: Thesis/Submission core API + fake similarity check service.

- [ ] Express project structure (`controllers/`, `models/`, `routes/`, `middleware/`, `services/`)
- [ ] `Thesis` model + routes: create, get, update status
- [ ] `Submission` model + routes: upload (PDF/DOCX, 20MB max), version tracking
- [ ] File upload middleware with type and size validation
- [ ] Fake similarity check endpoint: `POST /api/similarity/check` returns a hardcoded or randomized percentage plus a canned matched paragraph note
- [ ] `SimilarityResult` storage + `GET /api/similarity/:submissionId`
- [ ] `Comments` model + API: post comment, list by thesis, single reply field only
- [ ] Basic repository search endpoint: by title and student only
- [ ] Document endpoints in `docs/api-spec.md`

Explicitly cut: real plagiarism detection, DOCX to Markdown conversion, advanced search.

## Tutul - `feature/tutul-frontend-dashboards`

Owns: Student and Faculty UI, wired to real endpoints as they land.

- [ ] React project setup and routing shell (student, faculty, admin route groups)
- [ ] Login page + role-based redirect after auth
- [ ] Student dashboard: proposal status, submission list, defense info
- [ ] Proposal submission form that calls the real API
- [ ] Submission/file upload form that calls the real API
- [ ] Similarity result display with the fake percentage and note
- [ ] Supervisor dashboard: list of assigned students and thesis status
- [ ] Supervisor review screen: approve, reject, comment
- [ ] Comment thread UI with one level only
- [ ] Basic styling pass after the full loop works

Explicitly cut: polished design system, notification bell unless time remains, multi-department UI.

## Saman - `feature/saman-admin-db`

Owns: trimmed DB schema first, then admin UI.

- [ ] Finalize trimmed schema first
- [ ] `database/schema.sql` plus seed script with 3 test users and 1–2 sample theses
- [ ] Admin user list view
- [ ] Admin assign supervisor to a thesis
- [ ] Admin defense scheduling form: room, date, time, board member(s)
- [ ] Repository search page using Yasin's endpoint
- [ ] Admin view of all theses and status in a simple table

Trimmed schema:

```
Users              — id, name, email, password_hash, role
Thesis             — id, title, abstract, student_id, supervisor_id, status
Submission         — id, thesis_id, file_path, version_no, submitted_at
SimilarityResult   — id, submission_id, similarity_pct, matched_note
Comments           — id, thesis_id, author_id, content, created_at
DefenseSchedule    — id, thesis_id, room, date, time
BoardMembers       — id, defense_id, faculty_id
Evaluation         — id, defense_id, board_member_id, report_marks, presentation_marks, viva_marks, total_marks
Notifications      — id, user_id, message, is_read, created_at
```

Dropped: Departments, separate Proposal table, separate Files table.

Explicitly cut: department management, analytics reports, semester archiving.

## Jishan - `feature/jishan-auth-scheduling`

Owns: auth and defense/evaluation/notifications.

- [ ] JWT login/logout API
- [ ] Role middleware using `req.user.role`
- [ ] 3 seeded test accounts, one per role; skip email verification and forgot password
- [ ] `DefenseSchedule` model + API: create/update schedule, assign board members
- [ ] `Evaluation` model + API: enter marks and auto-calculate total
- [ ] `Notifications` model + simple in-app API
- [ ] Notification triggers for proposal approved, comment added, defense scheduled

Explicitly cut: email verification, forgot password, real email or push notifications, multiple evaluator averaging.

## Cross-team dependencies

| You | Waiting on | For |
|---|---|---|
| Yasin | Saman's schema | Thesis/Submission models |
| Yasin | Jishan's auth middleware | Protecting proposal/submission routes |
| Tutul | Yasin's API + Jishan's auth | Real data instead of mocks |
| Saman | None | Schema is the starting point |
| Jishan | Saman's `Users` table | Login query |

## If someone falls behind

Cut in this order:

1. Repository search → replace with a coming soon placeholder.
2. Notifications → cut entirely and mention it verbally.
3. Comment replies → use a single comment field.
4. Multiple board members → one evaluator is enough.

Never cut: proposal submit → supervisor review → file submission → similarity result → defense schedule → evaluation.

See [README.md](README.md) for the full project overview and [PLAN.md](PLAN.md) for the trimmed sprint timeline and rationale.
