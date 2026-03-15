# 🎬 NotNetflix - Fullstack Video Streaming Platform

A high-performance Netflix clone built with a modern Fullstack architecture. This platform delivers a seamless cinematic experience, integrating real-time movie data via TMDB API, dynamic YouTube trailer playback, and a secure Spring Boot backend for user authentication.

---

## 🚀 Key Features & Performance Stats

* **10,000+ Movies/TV Shows:** Real-time data synchronized directly from the international TMDB API.
* **Smart Billboard:** Featuring **Trailer-on-Background** (plays video trailers instantly upon clicking Play) - An optimized performance solution instead of local video storage.
* **Safe-Search Security:** Content security system via **Blacklist Keywords**, automatically filtering inappropriate results.
* **Optimized UX:** Ultra-fast API response time (< 500ms) by applying **Debounce** techniques and React Hooks state management.
* **Step-by-step Auth:** Professional two-step login flow, handling account validation logic from the Spring Boot Backend.

---

## 🛠 Tech Stack

### **Frontend (The User Experience)**
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### **Backend & Database (The Engine)**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### **Integrations**
![TMDB](https://img.shields.io/badge/TMDB_API-01d277?style=for-the-badge&logo=themoviedatabase&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube_IFrame-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

---

## 💡 Technical Highlights

1. **Hybrid Rendering:** Combined the power of Server-side and Client-side in Next.js 15 to optimize SEO and user experience.
2. **Trailer Filtering:** Automated logic to search and filter English "Official" trailers from the YouTube API.
3. **CORS Security:** Secure connection configuration between Frontend (port 3000) and Backend (port 8080).
4. **Interactive UI:** Utilized Loading Spinners and smooth CSS transitions to enhance the platform's realism.

---

## 💻 Installation & Setup

### **1. Run Backend (Spring Boot)**
```bash
# Navigate to the backend directory
cd notnetflix-backend
# Run the application (Default port 8080)
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