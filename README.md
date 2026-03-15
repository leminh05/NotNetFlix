# 🎬 NotNetflix - Fullstack Video Streaming Platform

A high-performance Netflix clone engineered with a modern Fullstack architecture. This platform delivers a seamless cinematic experience by integrating real-time movie metadata via TMDB API and dynamic video playback, powered by a robust Spring Boot backend.

---

## 🚀 Key Features & Performance Stats

* **10,000+ Movies/TV Shows:** Real-time data synchronized directly from the international TMDB API (Phase 4 completed).
* **Smart Billboard:** Featuring **Trailer-on-Background** – A high-performance solution for instant video previews without server-side storage overhead.
* **Safe-Search Security:** Advanced content filtering via **Blacklist Keywords** to ensure a secure viewing environment.
* **Optimized UX:** Ultra-low latency response time (< 500ms) utilizing **Debounce** techniques and React state orchestration.
* **Robust Authentication:** A secure two-step login pipeline (Email Validation -> Password) managed by Spring Security.

---

## 🛠 Technology Stack

### **Frontend (Client Layer)**
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### **Backend & Database (Core Engine)**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 💡 Technical Highlights

1. **RESTful Orchestration:** Secure communication between Next.js (Port 3000) and Spring Boot (Port 8080) with full CORS configuration.
2. **Dynamic Content Delivery:** Optimized metadata retrieval using asynchronous Spring services for high responsiveness.
3. **Cinematic UI/UX:** Implementation of Skeleton Screens, Loading Spinners, and CSS transitions for a premium streaming feel.
4. **Data Flexibility:** Utilized MongoDB's NoSQL nature to handle unstructured movie metadata efficiently.

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
## 👨‍💻 Author
Lê Quang Minh-2374802010310 - Fullstack Developer

Developed as a capstone project for the Advanced Java Programming course.
