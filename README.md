🚩 NotNetflix - Fullstack Movie Streaming Web App
A Netflix-inspired web application built with a modern Fullstack architecture, featuring a Spring Boot backend and a Next.js frontend. This project was developed as a midterm assignment for the Advanced Java Programming course.

🚀 Key Features
Smart Authentication Flow:

Two-step login process (Email check -> Password input).

Automatic routing between Sign In (existing users) and Sign Up (new users).

Security & Validation:

Strict password policy: Minimum 12 characters, including uppercase, lowercase, numbers, and symbols.

Email format validation using Regex.

Modern UI/UX:

Responsive Hero Banner with 2000x1125 high-resolution background.

Netflix-style movie rows with horizontal scrolling and hover effects.

Interactive navigation bar with a hidden "Sign Out" menu on user avatar hover.

Persistent Session:

Local storage integration to maintain login states and prevent unauthorized access to the /browse page.

🛠️ Tech Stack
Frontend
Framework: Next.js 14+ (App Router).

Styling: Tailwind CSS for a sleek, dark-themed UI.

State Management: React Hooks (useState, useEffect).

Backend
Framework: Java Spring Boot.

Database: MongoDB (NoSQL) for flexible user data storage.

Tools: MongoDB Compass for database management.

⚙️ Installation & Setup
Backend:

Ensure MongoDB is running locally.

Open notnetflix-backend in VS Code/IntelliJ.

Run DemoApplication.java. The server starts on http://localhost:8080.

Frontend:

Navigate to notnetflix-frontend.

Run npm install followed by npm run dev.

Access the app at http://localhost:3000.

📝 Credentials Policy
Passwords must be at least 12 characters long.

Must include Uppercase, Lowercase, Numbers, and Special Characters (e.g., !@#$%^&*).
