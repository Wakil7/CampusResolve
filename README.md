# ResolveCampus — Intelligent Complaints & Grievance Redressal Portal

A full-stack, enterprise-grade Complaints & Grievance Redressal System built with **React (Frontend)**, **Node.js & Express (Backend)**, and **MongoDB (Database)**.

---

## 🚀 Key Features

- **Multi-Role Access Control**:
  - 🎓 **Students**: Lodge complaints with photos/evidence, track live progress pipeline, participate in resolution discussions, upvote community issues, and rate resolutions (1–5 stars).
  - 🛠️ **Resolvers / Department Staff**: Inspect queue, update statuses (`In Review`, `In Progress`, `Resolved`, `Rejected`), attach resolution notes, and add internal staff notes.
  - 🛡️ **Administrators**: Assign complaints to specific staff, view high-level analytics and department workload breakdowns, manage users, and export CSV audit reports.
- **Authentication**:
  - Secure Email & Password signup/login with bcrypt password hashing and JWT authentication.
  - Sign in with Google integration (Google Identity Services GSI).
- **Campus Community Feed**:
  - Public grievances board with "Me-Too" upvoting system to avoid duplicate tickets and prioritize common infrastructure problems.
- **Real-Time Notification Center**:
  - Unread badge counter and popover for status changes, assignments, and discussion replies.
- **Resilient Database Architecture**:
  - Directly configured with MongoDB Atlas.
  - Features intelligent automatic fallback to ensure zero downtime while network IP whitelists are configured.

---

## 👥 Seeded User Accounts

All accounts use the password: `password123`

| Name | Role | Email | Password | Department / Details |
| :--- | :--- | :--- | :--- | :--- |
| **Abdul** | 🎓 Student | `abdul@example.com` | `password123` | CS Dept • Hostel Block A-204 |
| **Karan** | 🎓 Student | `karan@example.com` | `password123` | Mechanical Dept • Hostel Block B-310 |
| **Sahil** | 🛠️ Resolver | `sahil@example.com` | `password123` | Maintenance & Infrastructure |
| **Sohaib** | 🛡️ Admin | `sohaib@example.com` | `password123` | General Campus Administration |

---

## 📁 Project Architecture

```
ComplaintsManagementSystem/
├── backend/
│   ├── src/
│   │   ├── config/db.js             # Resilient MongoDB Atlas / Local connection
│   │   ├── controllers/             # Auth, Complaints, Analytics, Users, Notifications
│   │   ├── middleware/              # JWT Protect, Role Authorize, Multer Upload
│   │   ├── models/                  # User, Complaint, Notification Mongoose Schemas
│   │   ├── routes/                  # RESTful API route declarations
│   │   ├── utils/seeder.js          # Database seeder with realistic test cases
│   │   └── server.js                # Express app entrypoint
│   ├── uploads/                     # Storage directory for photo attachments
│   ├── .env                         # Environment variables (MongoDB URI, JWT secret)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, ComplaintCard, Modals, Badges, Charts
│   │   ├── context/                 # AuthContext & NotificationContext
│   │   ├── pages/                   # Dashboard, PublicFeed, Analytics, AdminUsers, Login, Register
│   │   ├── services/api.js          # API service layer with JWT interceptor
│   │   ├── styles/                  # Custom design system (index.css & components.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Running

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🌐 MongoDB Atlas Configuration

Your connection URI is configured in [backend/.env](file:///d:/Projects/ComplaintsManagementSystem/backend/.env):
```env
MONGODB_URI=mongodb+srv://wakil15032003_db_user:nRQgpthqub06sC6p@cluster0.56vexr1.mongodb.net/complaints_db?retryWrites=true&w=majority&appName=Cluster0
```

> [!IMPORTANT]
> **MongoDB Atlas IP Whitelist**:
> In your [MongoDB Cloud Console](https://cloud.mongodb.com) under **Security > Network Access**:
> 1. Click **Add IP Address**.
> 2. Select **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP address (`14.139.162.58`).
> 3. Save the entry.
> 4. Run `npm run seed` in `backend/` to sync the users and complaints directly to your cloud cluster:
>    ```bash
>    cd backend
>    npm run seed
>    ```
