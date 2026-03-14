# 🎬 NotNetflix - Fullstack Movie Streaming Platform

**NotNetflix** is a modern Fullstack movie streaming platform designed to replicate the premium Netflix experience. The project integrates real-time data from the **TMDB API**, handles robust backend logic with **Spring Boot**, and delivers a high-performance UI via **Next.js 15**.

---

## 🚀 Key Features

### 🎨 Frontend (Next.js 15 & Tailwind CSS)
* **Cinematic Branding:** A sleek, dark-themed UI featuring Glassmorphism effects.
* **Smart Billboard (Hero Banner):** * Dynamically fetches the week's top trending movie.
    * **Trailer-on-Background:** Automatically plays trailers on the banner background.
* **Dynamic Movie Rows:** Categorized browsing with Hover Zoom effects.
* **Advanced Search & Security:** Debounce logic and Safe-Search keyword filtering.

### ⚙️ Backend (Spring Boot & MongoDB)
* **Adaptive Authentication:** Two-step login process (Email check -> Password).
* **Session Management:** Protected route management via `localStorage`.

---

## 🛠 Tech Stack

### **Frontend**
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### **Backend & Database**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### **APIs & Tools**
![TMDB](https://img.shields.io/badge/TMDB_API-01d277?style=for-the-badge&logo=themoviedatabase&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube_IFrame-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 💡 Technical Highlights

1.  **Performance Optimization:** Managed `useEffect` dependencies to prevent infinite re-renders.
2.  **UX/UI Polish:** Integrated custom **Loading Spinners** for immediate visual feedback.
3.  **Type Safety:** Utilized TypeScript strict mode for robust development.

---

## 💻 Installation & Setup

### **1. Backend Setup (Spring Boot)**
```bash
# Navigate to backend directory
cd notnetflix-backend

# Ensure MongoDB is running, then run the application
./mvnw spring-boot:run
```

### **1. Frontend Setup (Spring Boot)**
```bash
# Navigate to frontend directory
cd notnetflix-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
## 💻 Installation & Setup
Minh - Fullstack Developer

Developed as a capstone project for the Advanced Java Programming course.