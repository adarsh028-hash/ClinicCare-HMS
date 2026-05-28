# ClinicCare HMS – Full Stack Hospital Management System

ClinicCare HMS is a full-stack SaaS-based Hospital Management System developed for small clinics and healthcare centers to efficiently manage patients, doctors, and appointments.

## Live Demo

Frontend: https://clinic-care-hms-client.vercel.app

---

# Features

* Secure JWT Authentication & Authorization
* Doctor Management System
* Patient Record Management
* Appointment Scheduling System
* Protected API Routes using Middleware
* Responsive Dashboard UI
* REST API Integration
* Secure Password Hashing using bcrypt
* Organized Client-Server Architecture

---

# Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL (Hosted on Supabase)      

## Authentication

* JWT (JSON Web Tokens)
* bcrypt.js

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase

---

# Project Architecture

Client → REST API → Express Server → PostgreSQL Database

* Frontend communicates with backend using REST APIs
* JWT used for secure authentication
* Passwords securely hashed using bcrypt
* PostgreSQL used for relational database management

---

# Folder Structure

```bash
ClinicCare-HMS/
│
├── client/        # React Frontend
├── server/        # Node.js + Express Backend
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/adarsh028-hash/ClinicCare-HMS.git
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file and add:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run Backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# Demo Credentials

```txt
Email: admin@test.com
Password: 123456
```

---

# Upcoming Enhancements

* Billing & Invoice System
* Analytics Dashboard
* Notifications & Reminders
* Advanced Role-Based Access
* Search & Filter Features
* Medical History Tracking

---

# Project Status

Actively improving with new SaaS features and scalability enhancements.

---

# Author

Adarsh Biradar

* GitHub: https://github.com/adarsh028-hash
* LinkedIn: https://linkedin.com/in/adarsh-biradar-38a428338
