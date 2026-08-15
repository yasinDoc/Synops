# Synops — Execution Plan (2–3 Week Sprint)

This plan replaces the full feature list for the current sprint. The goal is a demoable end-to-end workflow, not the full long-term scope.

## The One Rule

No one builds ahead of what is connected. A pretty UI with no working backend, or a backend with no UI, both fail the demo. Prioritize an ugly-but-working end-to-end flow over a polished broken one.

## What We Are Cutting

- Real similarity checker: fake it with a hardcoded percentage and a canned matched paragraph.
- Email verification and forgot password: cut.
- Real notifications: fake it with a simple in-app list.
- Admin analytics and charts: cut or fake with a simple table.
- DOCX/PDF to Markdown conversion: cut.
- Multi-department support: cut and hardcode one department.

## What Survives

Core demo loop:

Student submits proposal → Supervisor reviews, comments, approves → Student uploads final report → Fake similarity check runs and shows a percentage → Admin schedules the defense → Board member evaluates and enters marks → Result is shown.

If this works end to end with real data flowing through a real database, the project passes.

## Week-by-Week Plan

### Week 1 — Foundation

Day 1:
- Yasin: set up Express project structure.
- Tutul: set up React project and install dependencies.
- Saman: finalize the trimmed DB schema.
- Jishan: set up JWT auth skeleton.

Day 2:
- Yasin: thesis/proposal models and routes with dummy data if needed.
- Tutul: login page and role-based routing shell.
- Saman: run the schema and seed 3 test users.
- Jishan: login/logout API and role middleware.

Day 3:
- Yasin: wire proposal API to the real DB.
- Tutul: student dashboard shell.
- Saman: admin read-only user list.
- Jishan: wire auth into the backend routes.

Day 4:
- Yasin: submission and file upload API.
- Tutul: proposal submission form wired to the real API.
- Saman: admin assign supervisor UI.
- Jishan: defense schedule model and basic API.

Day 5:
- Yasin: fake similarity check endpoint.
- Tutul: supervisor review page.
- Saman: admin defense scheduling form.
- Jishan: evaluation model and API.

Days 6–7:
- Yasin: comments API.
- Tutul: comment thread UI.
- Saman: repository search.
- Jishan: in-app notifications model.

End of Week 1 checkpoint: login works for all 3 roles, and a student can submit a proposal that is visible to the supervisor.

### Week 2 — Connect the Full Loop

- Wire submission → fake similarity check → display result on both student and supervisor sides.
- Make supervisor approve/reject/comment flow work end to end.
- Let admin assign a defense date, room, and board members.
- Let board members see the assigned thesis, enter marks, and auto-calculate total marks.
- Let the student see defense info and result.

End of Week 2 checkpoint: the full loop works with ugly styling if needed.

### Week 3 — Glue and Demo Prep

- No new features.
- Fix bugs and polish only.
- Seed the database with realistic fake data.
- Write the demo script.
- Run the demo twice before the real presentation.

## Trimmed DB Schema

Use only the tables needed for the surviving features:

- Users — id, name, email, password_hash, role
- Thesis — id, title, abstract, student_id, supervisor_id, status
- Submission — id, thesis_id, file_path, version_no, submitted_at
- SimilarityResult — id, submission_id, similarity_pct, matched_note
- Comments — id, thesis_id, author_id, content, created_at
- DefenseSchedule — id, thesis_id, room, date, time
- BoardMembers — id, defense_id, faculty_id
- Evaluation — id, defense_id, board_member_id, report_marks, presentation_marks, viva_marks, total_marks
- Notifications — id, user_id, message, is_read, created_at

Dropped for the sprint:
- Departments
- Proposal table
- Files table

## What Each Person Owns

- Yasin — Thesis/Submission API, fake similarity endpoint, comments API.
- Tutul — Student and Faculty pages, wired to real endpoints as they land.
- Saman — Schema first, then admin pages and repository search.
- Jishan — Auth, defense scheduling, evaluation, notifications.

## If You Fall Behind

Cut in this order, but do not touch the core loop:

1. Repository search.
2. Notifications.
3. Comments thread depth.
4. Multiple board members.

The core loop is non-negotiable: proposal → review → submission → similarity → defense → evaluation.