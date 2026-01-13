# Shouty – Scalable URL Shortener Platform

Shouty is a modern, full-stack URL shortener platform that allows users to generate short, shareable links from long URLs and track their usage in real time. The system is designed with scalability, performance, and clean architecture in mind, making it suitable for production use and future expansion.

---

## Features

### 🔗 URL Shortening
- Generate short, unique URLs from long links
- Collision-free short code generation
- Fast redirection with minimal latency

### 📊 Analytics & Tracking
- Track number of times a link is accessed
- Store click count and creation timestamps
- Scalable counter updates using background workers

### 👤 Authentication & User Management
- Secure user authentication using JWT
- Google OAuth integration
- Each user manages their own shortened URLs
- Protected routes for authenticated actions

### 🛡️ Security & Validation
- URL validation and sanitization
- Token-based authorization
- Secure handling of environment variables

### ⚡ Performance & Scalability
- Redis-backed queue for async processing
- Background workers for incrementing click counts
- Designed for high read throughput

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Redis
- JWT Authentication

### Queue & Caching
- BullMQ
- Redis

---


---

## How It Works

### 1️⃣ URL Creation
- Authenticated user submits a long URL
- Backend generates a unique short code
- URL mapping is stored in MongoDB

---

### 2️⃣ Redirection
- When a short URL is accessed:
  - User is redirected to the original long URL
  - Click event is pushed to a Redis queue

---

### 3️⃣ Background Processing
- Worker consumes queue events
- Click count is incremented asynchronously
- Ensures fast redirection and accurate analytics

---

### 4️⃣ Analytics Dashboard
- Users can view all their shortened URLs
- Each URL displays click count and creation date

---

## Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Git

---

### Clone the Repository
```bash
git clone https://github.com/Shubham-rawat0/Shouty.git
cd Shouty

