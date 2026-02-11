# QC Module Application

A comprehensive Quality Control (QC) management system built with a modern tech stack. This application allows users to manage inspection tasks, perform detailed QC checks with mandatory evidence (comments & images), and generate reports.

##  Data Flow & Features

1.  **Task Management**:
    *   **Create Tasks**: Users can create new QC tasks with details like Work Order, Project, Department, etc.
    *   **Assign**: Tasks must be assigned to an inspector (self-assign) before work begins.
    *   **Search**: Real-time filtering of tasks by Work Order or Project.

2.  **QC Inspection Workflow**:
    *   **Strict Validation**: Each checkpoint (Pass/Fail) requires a **mandatory comment** and **image upload**.
    *   **Progress Tracking**: Application prevents submission until all checks are complete.
    *   **Responsive UI**: Optimized for Tablets (Inspectors on the floor) and Desktops (Managers).

3.  **Reporting**:
    *   **Clean Print View**: Generates a printer-friendly version of the inspection report.

##  Tech Stack

### Frontend
*   **React** (Vite)
*   **Tailwind CSS** (v4)
*   **Shadcn UI** (Components)
*   **Lucide React** (Icons)
*   **React Query** (State Management)
*   **Axios** (API Requests)

### Backend
*   **NestJS** (Framework)
*   **PostgreSQL** (Database via Neon)
*   **Drizzle ORM** (Type-safe SQL)
*   **Multer** (File Uploads)

---

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database URL (Neon DB recommended)

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

**Environment Setup**:
Create a `.env` file in `backend/` and add your database connection string:
```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

**Database Migration**:
Push the schema to your database:
```bash
npx drizzle-kit push
```

**(Optional) Seed Data**:
Populate the database with initial tasks:
```bash
npx tsx src/db/seed.ts
```

Start the Server:
```bash
npm run start:dev
```
*   Server runs on: `http://localhost:3000`
*   API: `http://localhost:3000/api`
*   Uploads: `http://localhost:3000/uploads`

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
*   App runs on: `http://localhost:5173`

---

##  Usage Guide

1.  **Dashboard**: Open the app to see the Task List.
2.  **Create Task**: Click the "+ Create New Task" button to add a job.
3.  **Assign**: Click "Assign to Me" on any pending task.
4.  **Inspect**: Click "View Details". Toggle checks to "Pass" or "Fail".
5.  **Evidence**: You *must* upload an image and add a comment for every check.
6.  **Submit**: Once all sections are green, click "Complete Inspection".

##  Project Structure

```
.
├── backend/            # NestJS API & Database
│   ├── src/
│   │   ├── db/         # Drizzle Schema & Config
│   │   ├── qc/         # QC Logic & Endpoints
│   │   ├── tasks/      # Task Management
│   │   └── uploads/    # File handling
│   └── uploads/        # Local storage for images
│
└── frontend/           # React UI
    ├── src/
    │   ├── components/ # Reusable UI components
    │   │   ├── layout/ # Sidebar, Header
    │   │   └── qc/     # QC specific components
    │   └── pages/      # QCList & QCDetail
```
