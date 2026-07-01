V2.0

New Features
- DOCX Resume Upload
- Copy Match Analysis
- Copy Cover Letter
- Download Cover Letter DOCX

UI Improvements
- Removed Resume Text Preview
- Improved Resume Upload Experience



---

## V2.1 – Resume Rewrite & UX Improvements
Release Date:2026-07-02

### 🚀 New Features

#### Resume Rewrite
- Added AI-powered **Optimised Resume** generation.
- Resume is rewritten to better align with the selected job description.
- Maintains truthful experience while improving wording, structure and ATS compatibility.
- Supports copying the optimised resume.
- Supports downloading the optimised resume as a Word document (.docx).

---

### ✨ User Experience Improvements

#### Resume Match Page
- Redesigned the Resume Match workflow into a cleaner, step-based layout.
- Reduced page length for improved usability.
- Introduced a tabbed results interface:
  - Match Analysis
  - Cover Letter
  - Optimised Resume
- Automatically opens the **Optimised Resume** tab after generation.

---

### 📄 Export Features

- Added Copy button for Optimised Resume.
- Added DOCX download for Optimised Resume.
- Reused the existing export experience for consistency across the application.

---

### 🔧 Backend

- Extended the Resume Match API response with:

```json
{
  "status": "success",
  "match_analysis": "...",
  "cover_letter": "...",
  "optimised_resume": "..."
}
```

- Added a dedicated AI workflow for Resume Rewrite.
- Updated Make.com JSON response structure.
- Preserved compatibility with existing Match Analysis and Cover Letter features.

---

### 🐞 Improvements

- Improved overall page organisation.
- Better separation between inputs and generated outputs.
- More consistent UI across all AI-generated results.

---

## Current Product Features

- Resume Match Analysis
- AI Cover Letter Generator
- AI Resume Rewrite
- Interview Question Generator
- STAR Answer Builder
- DOCX Resume Upload
- DOCX Export
- Copy-to-Clipboard Actions
- Access Code Protection
- Responsive SaaS-style Interface
