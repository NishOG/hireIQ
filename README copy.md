# HireIQ — AI Hiring Intelligence System

A complete, production-ready AI-powered hiring intelligence web application. Evaluate, rank, and compare job candidates with AI precision — all in the browser, no server required.

---

## 🚀 Quick Start

1. Open `index.html` in your browser (or deploy to any static host)
2. Click **"Get Started Free"** to create an account
3. Or use the demo: **Email:** `demo@hireiq.ai` | **Password:** `demo1234`
4. Navigate to **New Evaluation** → Paste JD → Add Resumes → View AI Rankings

---

## 📄 Pages & Navigation

| Route | Page | Description |
|-------|------|-------------|
| `#/` | Landing Page | Hero, features showcase, how-it-works, testimonials |
| `#/login` | Login | Email/password auth with demo account |
| `#/signup` | Sign Up | New account registration with password strength meter |
| `#/dashboard` | Dashboard | Stats overview, recent evaluations, quick actions, charts |
| `#/evaluate` | New Evaluation | 3-step wizard: JD analysis → resume upload → AI processing |
| `#/results` | Results | Full ranked results with all AI insights |
| `#/history` | Past Evaluations | All saved evaluations with search and sort |

---

## ✅ Implemented Features (All 14)

### Feature 1: Resume Parsing Engine
- Extracts name, skills, experience, projects, education from plain text
- Cleans and normalizes resume content
- Marks empty/short resumes as "Invalid" with score = 0

### Feature 2: JD Analyzer
- Parses required vs optional skills from job description
- Extracts experience years using regex
- Identifies role keywords (frontend, backend, API, etc.)

### Feature 3: Semantic Skill Matching
- Skill synonym map (React ≈ React.js, Node.js ≈ Backend JavaScript, etc.)
- Exact match, partial match, and missing skill categorization
- Color-coded skill chips: green (exact), yellow (partial), red (missing)

### Feature 4: AI Scoring System
```
Score = (0.40 × Skill Match) + (0.25 × Experience) + (0.20 × Projects) + (0.15 × Semantic)
```

### Feature 5: Candidate Ranking
- All candidates ranked descending by score
- Tie-breaking: higher experience → better project relevance
- Top candidates highlighted with gold/silver/bronze styling

### Feature 6: Explainable AI
- Per-candidate strengths and weaknesses lists
- 2-3 line AI reasoning paragraph
- Accessible in candidate detail modal

### Feature 7: Bias Reduction Layer
- Strips email, phone, URLs before evaluation
- Strips gender pronouns (he/she/his/her)
- "Bias-Free" badge shown on all evaluations

### Feature 8: Skill Gap Detection
- Lists all missing required skills per candidate
- Provides specific, actionable improvement suggestions

### Feature 9: Comparative Analysis
- Compare tab: select 2-3 candidates side by side
- Full comparison table (score, skills, experience, decision)
- AI explanation of ranking differences

### Feature 10: Confidence Score
- Based on resume length, section count, skill density
- Visual circular gauge per candidate (0-100%)
- Low confidence warning for short/vague resumes

### Feature 11: Resume Clustering
- By Fit Level: Strong (≥70) / Moderate (45-69) / Weak (<45)
- By Specialty: Frontend-Heavy / Backend-Leaning / Full Stack / Fresher
- Toggle between cluster views

### Feature 12: Dashboard Filters
- Score range slider (0-100)
- Classification checkboxes (Strong/Moderate/Weak)
- Decision filter (All/Hired/Rejected/Pending)
- Real-time filtering of candidate list

### Feature 13: Hire/Reject Simulation
- Hire and Reject buttons on every candidate row
- Toggle state with visual feedback (row color changes)
- Summary counter: X Hired / Y Rejected / Z Pending
- Decision state persists in localStorage

### Feature 14: PDF Export
- Full shortlist report with candidate names, scores, classification
- Per-candidate strengths, weaknesses, AI reasoning
- Professional formatting with branded header
- Powered by jsPDF + AutoTable

---

## 🎨 Design System

- **Color Scheme:** Deep indigo/purple primary + green/red semantic colors
- **Dark/Light Mode:** Toggle in navbar, persists via localStorage
- **Typography:** Inter (Google Fonts)
- **Cards:** Glassmorphism with backdrop blur
- **Animations:** Fade-in, slide-in, scale-in on modals
- **Responsive:** Mobile-friendly with collapsible sidebar

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom variables, animations) |
| Logic | Vanilla JavaScript ES6+ |
| Charts | Chart.js 4.4 (CDN) |
| PDF Export | jsPDF 2.5 + AutoTable (CDN) |
| Icons | Font Awesome 6.5 (CDN) |
| Fonts | Google Fonts — Inter |
| Storage | localStorage (no backend needed) |
| Routing | Hash-based SPA router |

---

## 📦 File Structure

```
index.html                  Main HTML entry point
css/
  style.css                 Complete design system (dark/light, components)
js/
  data.js                   Sample data, skill synonyms, JD patterns
  engine.js                 AI analysis engine (all 14 features)
  auth.js                   Authentication (localStorage-based)
  app.js                    Router, utilities, PDF export, toast system
  pages/
    landing.js              Landing page
    login.js                Login page
    signup.js               Signup page
    dashboard.js            Dashboard with charts
    evaluate.js             3-step evaluation wizard
    results.js              Full results viewer
    history.js              Past evaluations list
```

---

## 💾 Data Storage

All data is stored in `localStorage` under these keys:

| Key | Description |
|-----|-------------|
| `hireiq_users` | Registered user accounts |
| `hireiq_session` | Current user session |
| `hireiq_evaluations` | All saved evaluation results (max 20) |
| `hireiq_theme` | Dark/light mode preference |

---

## 🎭 Demo Data

8 pre-loaded sample candidates for the "Senior Frontend Developer" role:
1. **Alice Johnson** — Strong Fit (React, TypeScript, 6y exp)
2. **Bob Martinez** — Moderate Fit (React, Node.js, 3y exp)
3. **Carol Chen** — Moderate Fit (React, CSS, 2y exp)
4. **David Kim** — Strong Fit (TypeScript expert, 7y exp)
5. **Emma Wilson** — Weak Fit (HTML/CSS beginner)
6. **Frank Patel** — Moderate Fit (Backend developer with some React)
7. **Grace Lee** — Strong Fit (Frontend Architect, 8y exp)
8. **Henry Brown** — Invalid Resume (empty submission)

---

## 🔐 Authentication

- Registration stores a hashed (btoa) password in localStorage
- Session persists across page reloads
- Protected routes redirect to `/login` automatically
- Demo account: `demo@hireiq.ai` / `demo1234`

---

## 📋 Next Steps / Roadmap

- [ ] Real AI/LLM API integration (OpenAI, Anthropic) for deeper reasoning
- [ ] Multi-language resume support
- [ ] Email notifications for hire/reject decisions
- [ ] Team collaboration features
- [ ] Resume file upload (PDF parsing via pdf.js)
- [ ] ATS (Applicant Tracking System) integration
- [ ] Advanced analytics with historical trend charts
- [ ] Settings page (account management, notification preferences)
