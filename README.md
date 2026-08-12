# Synops

Thesis Management System for the university project.

## Branch Plan

Use `main` only for demo-ready code.
Use `dev` for combined team work before final merge.

### Team Branches

- `feature/yasin-backend` - backend routes, API, database connection, similarity checker
- `feature/tutul-frontend` - frontend pages, layouts, forms, dashboards
- `feature/saman-admin-db` - admin panel, database tables, seed data, reports
- `feature/jishan-auth-scheduling` - login/signup, role access, defense scheduling, notifications

## Simple Git Workflow

1. Start from `dev`.
2. Work only in your own feature branch.
3. Make small commits.
4. Push your branch to GitHub.
5. Open a pull request into `dev`.
6. After checking, merge `dev` into `main` when the team is ready for demo.

## Easy Commands

Create a branch from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-branch-name
```

Save your work:

```bash
git add .
git commit -m "feat: short message here"
```

Send your work to GitHub:

```bash
git push -u origin feature/your-branch-name
```

If you already have a branch and only want to update it later:

```bash
git add .
git commit -m "fix: small update"
git push
```

## Beginner Tips

- Keep changes small.
- Pull from `dev` before starting new work.
- Do not work directly on `main`.
- If Git asks for a message editor, write the commit message and save it.
