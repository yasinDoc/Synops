# Synops API Spec

This file is the starter API map for the sprint scope.

Protected endpoints require: `Authorization: Bearer <token>`.

## Base

- `GET /api` - API status
- `GET /api/health` - health check

## Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Thesis and Submission

- `GET /api/theses`
- `GET /api/theses/search?q=keyword` (title or student name)
- `POST /api/theses`
- `GET /api/theses/:id`
- `PATCH /api/theses/:id/status`
- `GET /api/submissions`
- `POST /api/submissions` (multipart form-data: `thesisId`, `reportFile`)

## Similarity

- `POST /api/similarity/check`
- `GET /api/similarity/:submissionId`

## Comments

- `GET /api/comments/thesis/:thesisId`
- `POST /api/comments`

## Defense

- `GET /api/defense`
- `POST /api/defense`

## Evaluation

- `GET /api/evaluation/defense/:defenseId`
- `POST /api/evaluation`

## Notifications

- `GET /api/notifications/:userId`
- `POST /api/notifications`