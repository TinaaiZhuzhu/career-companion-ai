# Career Companion AI - Daily Deployment Workflow

## Purpose

This guide is used whenever new features, bug fixes, UI improvements, or prompt updates are completed and need to be deployed to production.

---

# Standard Deployment Workflow

## Step 1 - Test Locally

Start local development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Verify:

* Resume Match works
* Interview Questions works
* STAR Builder works
* Access Code works

Do NOT deploy if local testing fails.

---

# Step 2 - Check Changed Files

Open Cursor Terminal:

```powershell
git status
```

Example:

```powershell
modified: app/page.tsx
modified: app/star-builder/page.tsx
```

Review changes before deployment.

---

# Step 3 - Add Files

Stage all changes:

```powershell
git add .
```

---

# Step 4 - Create Commit

Create a meaningful commit message.

Examples:

```powershell
git commit -m "Add access code protection"
```

```powershell
git commit -m "Add copy answer button"
```

```powershell
git commit -m "Improve STAR builder prompt"
```

```powershell
git commit -m "Fix webhook JSON response"
```

Avoid generic messages like:

```powershell
git commit -m "Update"
```

---

# Step 5 - Push to GitHub

Push changes:

```powershell
git push
```

Expected result:

```powershell
To github.com:username/career-companion-ai.git
...
main -> main
```

---

# Step 6 - Wait for Vercel Deployment

Open:

https://vercel.com/dashboard

Project:

```text
career-companion-ai
```

Deployment should start automatically.

Status:

```text
Building...
```

↓

```text
Ready
```

Typical deployment time:

```text
30 seconds - 2 minutes
```

---

# Step 7 - Production Testing

Open production URL.

Test:

## Resume Match

* Submit Resume
* Submit JD
* Verify Match Analysis
* Verify Cover Letter

---

## Interview Questions

* Submit JD
* Select Experience Level
* Verify Questions Generated

---

## STAR Builder

* Submit Question
* Submit Example
* Select Style
* Select Length
* Verify STAR Answer

---

## Access Code

* Verify login works
* Verify logout works

---

# Deployment Complete

Deployment is complete when:

✅ GitHub updated

✅ Vercel deployment successful

✅ Production testing successful

---

# Daily Deployment Commands

Most commonly used commands:

```powershell
git status

git add .

git commit -m "Describe your changes"

git push
```

Example:

```powershell
git status

git add .

git commit -m "Improve interview question generation"

git push
```

---

# Emergency Rollback

View commit history:

```powershell
git log --oneline
```

Example:

```powershell
a1b2c3 Add access code protection
d4e5f6 Add STAR builder
g7h8i9 Initial MVP release
```

Rollback to previous version:

```powershell
git reset --hard COMMIT_ID
```

Then:

```powershell
git push --force
```

WARNING:

Only use rollback when production is broken.

---

# Future Feature Workflow

For every new feature:

1. Build in Cursor
2. Test locally
3. git status
4. git add .
5. git commit -m "Feature name"
6. git push
7. Verify Vercel deployment
8. Test production site

Repeat for every release.

This is the standard software development workflow.
