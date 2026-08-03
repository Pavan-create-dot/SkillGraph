# SkillGraph AI – Candidate Interview Readiness & Performance Platform

**SkillGraph AI** is a lightweight, full-stack candidate placement preparation platform built with **React 19**, **Express.js**, **Prisma ORM**, and **Google Gemini AI**. 

It is designed with a clean, modular architecture that can be easily explained in technical interviews.

---

## 🚀 Key Features (3 Core Pillars)

1. **Dual-Tab Resume File Parser (`/resume`)**
   - Drag-and-drop `.pdf`, `.docx`, and `.txt` file uploads using `multer` and `pdf-parse` v2.
   - Extracts candidate tech stacks, experience highlights, and skill gap recommendations powered by Google Gemini AI.

2. **Role-First 3-Step Placement Simulator (`/interview`)**
   - **Step 1**: Target Role Input & Confirmation.
   - **Step 2**: Selection of 3 Core Interview Types (*Technical & Coding*, *System Design & Architecture*, *Behavioral & HR*).
   - **Step 3**: Interactive practice session with per-answer AI evaluation and 0–100 scoring.

3. **Interview Score Trajectory Analytics (`/skill-graph`)**
   - Interactive SVG progress graph displaying candidate score improvements over time.
   - Session inspector detailing score breakdowns across 4 competencies (*Technical Concepts*, *Problem Solving*, *Communication*, *System Design*).
   - Historical practice log with performance ratings (*Strong Hire*, *Hire*, *Needs Practice*).

---

## 📐 Architecture & Tech Stack

```text
SkillGraph/
├── backend/                   # Node.js + Express + Prisma ORM
│   ├── prisma/
│   │   └── schema.prisma      # Relational User & InterviewSession models
│   └── src/
│       ├── controllers/       # HTTP handlers (auth, user, resume, interview)
│       ├── services/          # Business logic & Gemini AI integration (ai, resume, interview, auth)
│       ├── middleware/        # JWT auth, rate limiter, request logger, error handler
│       ├── routes/            # Modular API endpoints (/api/auth, /api/resume, /api/interview, /api/users)
│       └── utils/             # ApiError, ApiResponse, asyncHandler, hashPassword
│
└── frontend/                  # React 19 + TypeScript + Vite
    ├── src/
    │   ├── api/               # Axios API client modules
    │   ├── components/        # ProtectedRoute, ErrorBoundary, InterviewProgressViz SVG
    │   ├── contexts/          # AuthContext & state management
    │   ├── layouts/           # MainLayout (Top-right profile, sidebar) & AuthLayout
    │   ├── pages/             # ResumePage, InterviewPage, SkillGraphPage, ProfilePage, Auth
    │   └── index.css          # Meridian Indigo + Vault Amber theme tokens
```

### Technology Choice Rationale (Interviewer Talking Points)
- **React 19 + Vite**: Ultra-fast build times, zero legacy overhead, lightweight component architecture.
- **Express + Prisma ORM**: Clean separation of concerns (Routes → Controllers → Services → Prisma Models).
- **Meridian Indigo Design System**: Dark enterprise styling (`#4338CA` Meridian Indigo primary with `#F59E0B` Vault Amber status accents).
- **Google Gemini 1.5 Flash API**: Low-latency structured JSON responses for candidate answer evaluation and resume parsing.

---

## 🛠️ API Reference Summary

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| **POST** | `/api/auth/register` | Public | Register new candidate profile |
| **POST** | `/api/auth/login` | Public | Authenticate credentials and issue JWT |
| **GET** | `/api/users/profile` | JWT | Fetch authenticated user profile |
| **POST** | `/api/resume/analyze` | JWT | Upload resume file or text for AI skill analysis |
| **POST** | `/api/interview/start` | JWT | Initialize a role-first mock interview session |
| **POST** | `/api/interview/answer` | JWT | Submit answer for AI scoring & feedback |
| **GET** | `/api/interview/history` | JWT | Fetch completed interview session history & scores |

---

## 💻 Local Setup & Execution

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` inside `backend/`:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Initialize Database & Run
```bash
# In /backend
npx prisma db push
npm run dev

# In /frontend (separate terminal)
npm run dev
```

Open `http://localhost:5173` to launch the application.
