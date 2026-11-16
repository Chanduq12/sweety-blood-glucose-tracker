Sweety – Blood Glucose Tracker

A full-stack web application to track daily blood glucose readings and generate reports.

Tech Stack

- Frontend: React, JavaScript, CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT and bcrypt

Features

- User registration and login
- Secure password hashing
- Add, view, edit, and delete glucose readings
- Four daily reading slots:
  - Morning (Fasting)
  - After Breakfast
  - After Lunch
  - After Dinner
- Input validation
- Daily, month-to-date, and previous-month reports
- Highest, lowest, average, and total readings

Project Structure

- "frontend/" – React application
- "backend/" – Express API and PostgreSQL integration

Setup

1. Clone this repository.
2. Install backend dependencies using "npm install" inside "backend/".
3. Configure "backend/.env" using ".env.example".
4. Install frontend dependencies using "npm install" inside "frontend/".
5. Start the backend and frontend development servers.

Security

Passwords are hashed using bcrypt. JWT authentication protects user-specific reading data. Environment variables are excluded from Git.

Author

Chandas M D
