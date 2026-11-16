Sweety – Blood Glucose Tracker

A full-stack web application to track daily blood glucose readings and view reports.

Tech Stack

- Frontend: React.js, Vite, CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT and bcrypt

Features

- User registration and login
- Secure password hashing
- Add, view, edit and delete glucose readings
- Four daily time slots
- Input validation
- Daily glucose report
- Month-to-date report
- Previous-month report
- User-specific reading access

Project Setup

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd sweety

2. Backend setup

cd backend
npm install

Create a ".env" file using ".env.example" as a reference and configure your PostgreSQL credentials.

Start the backend:

node server.js

3. Frontend setup

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL shown by Vite in your browser.

Database

Create a PostgreSQL database named "sweety_db" and execute the SQL table creation statements.

Author

Chandas M D