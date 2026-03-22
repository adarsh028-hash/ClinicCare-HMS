# ClinicCare – Mini SaaS Hospital Management System

ClinicCare is a full-stack SaaS application designed for small clinics to manage patients, doctors, and appointments efficiently.

# Tech Stack
- Frontend: React, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT (JSON Web Tokens) & bcrypt 

# Key Features
- Secure user authentication (Login)
- User signup (in progress)
- Doctor management system
- Patient record management
- Appointment booking and scheduling
- Organized dashboard for easy data access
- REST APIs for seamless frontend-backend communication

# System Architecture
- Client-server architecture using REST APIs
- Token-based authentication using JWT
- Secure password storage using bcrypt hashing
- PostgreSQL used for structured relational data

# Structure of the Project 
ClinicCare-HMS/
│
├── client/ → Frontend (React + Vite)
├── server/ → Backend (Node.js + Express)
└── README.md

# Installation & Setup

## Clone the repository

git clone https://github.com/adarsh028-hash/ClinicCare-HMS.git

## Backend setup 

cd server
    npm install

    Create a .env file and add:
    PORT=5000
    DATABASE_URL=your_postgres_connection
    JWT_SECRET=your_secret_key

Run backend:
npm run dev

## Frontend Setup 

    cd client
    npm install
    npm run dev

# Demo Login 

Email: admin@test.com
Password: 123456

# Future requirements to be improved 

- Billing & invoice system
- Analytics dashboard
- Notifications & reminders
- Role-based access (Admin / Doctor / Staff)
- Deployment (AWS / Vercel / Render)


# Project Status

Project is under development