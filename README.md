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

## Project Structure

