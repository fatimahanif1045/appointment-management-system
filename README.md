# appointment-management-system
# admin-dashboard

## ■ Project Overview

This is an Admin Dashboard built with React, and TypeScript for the frontend, database MongoDB and Node.js with Express for the backend. It includes authentication, product management, and analytics.

---

## ■ Setup Instructions

### ▶ Backend

1. Navigate to the backend directory:
   ```bash
   cd backend

2. Install dependencies:

npm install
Create a .env file (see .env for reference).

3. Run the development server:

bash
npm run dev


▶ Frontend
1. Navigate to the frontend directory:

bash
cd frontend

2. Install dependencies:

bash
npm install

3. Create a .env file (see .env.example for reference).

Run the development server:

bash
npm run dev


■ Environment Variable Requirements
See .env.example in both backend and frontend directories for required variables. You must provide:

MongoDB connection URI

JWT secrets

API base URLs

■ API Documentation (Brief)
Auth Routes
POST /api/auth/login
Body: { email, password }
Response: JWT token

POST /api/auth/register
Body: { email, password, name }
Response: user info

Product Routes
GET /api/products – Fetch all products

POST /api/products – Create new product

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

.env.example
Backend

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your_jwt_secret_key

Frontend

env
VITE_API_BASE_URL=http://localhost:5000/api
