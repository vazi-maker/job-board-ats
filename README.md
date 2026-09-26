# 💼 Job Board & ATS — Full Stack Project

A full-featured Job Board and Applicant Tracking System built with:
- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT
- **File Uploads**: Multer (PDF resumes)
- **Email**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or use MongoDB Atlas)

---

### 1. Backend Setup

```bash
cd server
cp .env.example .env    # Fill in your values
npm install
npm run dev             # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## 📁 Project Structure

```
job-board-ats/
├── server/             # Node.js + Express backend
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth, RBAC, file upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── utils/          # Email utility
│   └── uploads/        # Stored resume files
│
└── client/             # React + Vite frontend
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Navbar, JobCard, StatusBadge, ProtectedRoute
        ├── context/    # AuthContext (global auth state)
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── JobDetail.jsx
            ├── seeker/Dashboard.jsx
            └── employer/
                ├── Dashboard.jsx
                ├── PostJob.jsx
                └── Applicants.jsx
```

---

## 🔑 User Roles & Features

### Job Seeker
- Browse and search jobs by keyword, type, location
- View detailed job page
- Apply with PDF resume + cover letter
- Track all applications with status timeline

### Employer
- Post new job listings (title, type, salary, skills, requirements)
- Manage and toggle active/inactive status of listings
- View all applicants per job
- Update applicant status (Applied → Under Review → Interview Scheduled → Offer / Rejected)
- Download applicant resumes
- Automatic email notification sent to applicant on status change

---

## 🌐 API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get profile |
| GET | `/api/jobs` | Public | List jobs (with filters) |
| GET | `/api/jobs/:id` | Public | Get job detail |
| POST | `/api/jobs` | Employer | Post a job |
| PUT | `/api/jobs/:id` | Employer | Edit job |
| DELETE | `/api/jobs/:id` | Employer | Delete job |
| GET | `/api/jobs/employer/my-jobs` | Employer | My posted jobs |
| POST | `/api/applications/:jobId/apply` | Job Seeker | Apply to job |
| GET | `/api/applications/my` | Job Seeker | My applications |
| GET | `/api/applications/job/:jobId` | Employer | Applicants for job |
| PATCH | `/api/applications/:id/status` | Employer | Update status |
| GET | `/api/applications/:id/resume` | Employer | Download resume |
