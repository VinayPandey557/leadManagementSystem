📌 Lead Management System

A full-stack Lead Management System built with React (frontend), Express + Prisma (backend), and PostgreSQL (DB).

🚀 Features

Authentication (Register / Login / Logout / Current User)

JWT stored in httpOnly cookies (secure, not in localStorage)

Passwords hashed with bcrypt

Lead Management (CRUD)

Create, Read, Update, Delete leads

Each lead has fields: name, email, phone, company, city, state, status, source, score, leadValue, lastActivityAt, isQualified

Server-side Pagination (page, limit)

Server-side Filtering

Strings → equals, contains

Enums (status, source) → equals, in

Numbers → equals, gt, lt, between

Dates → on, before, after, between

Boolean → equals

Frontend (React)

Login / Register pages

Leads list in a grid with pagination & filters

Create / Edit Lead form

Deployment

Frontend on Vercel

Backend on Render / Railway

Database on Neon / Railway / Render

🛠 Tech Stack

Frontend: React (Vite), Axios, React Router, AG Grid

Backend: Node.js, Express.js, Prisma ORM

Database: PostgreSQL

Auth: JWT + httpOnly cookies, bcrypt

Hosting:

Frontend → Vercel

Backend → Render/Railway

DB → Neon (Postgres cloud)
