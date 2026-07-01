Career Companion AI - GitHub & Vercel Deployment Guide
Project Overview
This project was built using:
•	Cursor
•	Next.js
•	Make.com
•	OpenAI
•	GitHub
•	Vercel
The application contains three AI-powered tools:
1.	Resume Match & Cover Letter Generator
2.	Interview Questions Generator
3.	STAR Answer Builder
________________________________________
Part 1 - Install Git
Verify Git
Open Cursor Terminal:
git --version
Expected result:
git version 2.54.0.windows.1
If Git is not installed:
'git' is not recognized
Download and install Git for Windows.
Recommended installation settings:
•	Use bundled OpenSSH
•	Use native Windows Secure Channel library
•	Checkout Windows-style, commit Unix-style line endings
•	Git Credential Manager enabled
After installation:
•	Close Cursor
•	Reopen Cursor
Verify again:
git --version
________________________________________
Part 2 - Initialise Git Repository
Navigate to project folder:
cd "F:\AI projects\career-companion-ai"
Initialise Git:
git init
Check status:
git status
Add all files:
git add .
Create first commit:
git commit -m "Initial MVP release"
If prompted for identity:
git config --global user.name "GitHubUsername"
git config --global user.email "your@email.com"
Run commit again.
________________________________________
Part 3 - Create GitHub Repository
Create repository:
career-companion-ai
Repository settings:
•	Public or Private
•	Do NOT add README
•	Do NOT add .gitignore
•	Do NOT add License
Create repository.
Copy repository URL:
https://github.com/<username>/career-companion-ai.git
________________________________________
Part 4 - Push Project to GitHub
Connect local repository:
git remote add origin https://github.com/<username>/career-companion-ai.git
Rename branch:
git branch -M main
Push project:
git push -u origin main
GitHub login window may appear.
Authenticate successfully.
Verify repository contains:
app/
public/
package.json
README.md
________________________________________
Part 5 - Deploy to Vercel
Create account:
https://vercel.com
Sign in using GitHub.
________________________________________
Install GitHub App
When prompted:
Install Vercel GitHub App.
Recommended:
Only select repositories
Select:
career-companion-ai
Complete installation.
________________________________________
Import Project
Choose:
career-companion-ai
Vercel should automatically detect:
Framework: Next.js
Leave all settings as default.
Click:
Deploy
Deployment usually takes 1-3 minutes.
________________________________________
Part 6 - Verify Production Deployment
Open deployed Vercel URL.
Test all scenarios:
Scenario 1
Resume Match & Cover Letter
Verify:
•	Resume input works
•	JD input works
•	Match analysis generated
•	Cover letter generated
________________________________________
Scenario 2
Interview Questions Generator
Verify:
•	Job description submitted
•	Experience level selected
•	Questions generated successfully
________________________________________
Scenario 3
STAR Answer Builder
Verify:
•	Interview question submitted
•	User example submitted
•	Answer length selected
•	Output style selected
•	STAR answer generated successfully
________________________________________
Troubleshooting Learned During Development
Problem 1
Error:
npm is not recognized
Solution:
Install Node.js.
________________________________________
Problem 2
Error:
Running scripts is disabled on this system
Solution:
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
________________________________________
Problem 3
Error:
Received an invalid response from the analysis service
Root Cause:
Make Webhook Response returned invalid JSON due to unescaped line breaks.
Example:
{
  "match_analysis":"Line1
Line2"
}
Invalid JSON.
Solution:
Use:
JSON → Create JSON
before:
Webhook Response
This automatically escapes line breaks and special characters.
________________________________________
Problem 4
Scenario 3 Failed
Root Cause:
Request JSON and Response JSON were confused.
Incorrect:
{
  "interview_question":"...",
  "user_example":"..."
}
Correct:
{
  "status":"success",
  "star_answer":"..."
}
Create JSON must be built from AI output rather than webhook input.
________________________________________
Current Architecture
Browser ↓ Next.js Frontend ↓ API Route ↓ Make Webhook ↓ OpenAI ↓ Create JSON ↓ Webhook Response ↓ Frontend Display
________________________________________
MVP Status
Completed:
✅ Resume Match & Cover Letter
✅ Interview Questions Generator
✅ STAR Answer Builder
✅ GitHub Repository
✅ Vercel Deployment
✅ Production Testing
Project Status:
Production-ready MVP
