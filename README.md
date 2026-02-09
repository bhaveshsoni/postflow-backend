# 🚀 PostFlow - Enterprise Social Media Scheduler

A scalable, event-driven backend for scheduling and publishing social media posts. Built with a focus on **reliability**, **type safety**, and **clean architecture**.

## 🛠️ Tech Stack
* **Runtime:** Node.js (v20+)
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Queue/Scheduling:** Redis + BullMQ
* **Validation:** Zod
* **Storage:** AWS S3 (In Progress) / Cloudinary
* **Architecture:** MVC + Services + Repository Pattern

## ✨ Key Features
* ✅ **JWT Authentication** (Secure HttpOnly implementation)
* ✅ **Event-Driven Scheduler** (Decoupled Producer/Consumer with Redis)
* ✅ **Robust Error Handling** (Centralized Error Middleware)
* ✅ **Type-Safe Validation** (Zod Middleware)
* ✅ **Scalable Worker System** (Background job processing)

## 🚀 Getting Started

### 1. Prerequisites
* Node.js & npm
* Redis (Running locally or via Docker)
* MongoDB

### 2. Installation
```bash
# Clone the repo
git clone [https://github.com/bhaveshsoni/postflow-backend.git](https://github.com/bhaveshsoni/postflow-backend.git)

# Install dependencies
npm install

# Setup Environment
cp .env.example .env
# (Fill in MONGO_URI, REDIS_HOST, JWT_SECRET)
