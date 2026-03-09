🎬 NotNetflix - Fullstack Movie Streaming Clone
NotNetflix is a comprehensive Netflix clone built with a modern fullstack architecture. This project focuses on integrating real-time global movie data, optimizing User Experience (UX), and implementing robust authentication management.

🚀 Key Features
🎨 Frontend (Next.js 15 & Tailwind CSS)
Signature Branding: A custom-designed logo featuring the distinct NOT (white) and NETFLIX (red) color split.

Smart Billboard: Dynamically fetches a random trending movie from the TMDB API to serve as a high-impact hero banner upon every page refresh.

Enhanced Movie Rows: * Ghost Scrollbars: Default browser scrollbars are hidden for a sleek, premium aesthetic.

Interactive Navigation: Custom side-scroll arrows that appear on hover for intuitive browsing.

Cinematic UX: Smooth scrolling animations and scale-up effects on poster hover.

Dynamic Modals: A detailed "More Info" pop-up that displays real-time synopses, ratings, and backdrops for selected titles.

Smart Categorization: Automatically organizes content into curated rows: Trending, Action, Comedy, Horror, and Romance.

Clean Codebase: Fully written in TypeScript with zero ESLint errors, utilizing advanced React Hooks such as updater functions for state management.

⚙️ Backend (Spring Boot & MongoDB)
Authentication: Robust logic for user sign-in and account validation.

Security: Session management and secure handling of user credentials.

Database: High-performance storage of user data using MongoDB.

🛠 Tech Stack
Technology           
Next.js 15           Core framework featuring App Router and Server-Side Rendering (SSR).
Tailwind CSS         Utility-first CSS for rapid, responsive, and modern UI styling.
Spring Boot          Powering a scalable RESTful API backend.
TMDB API             Global source for movie metadata and high-quality assets.
MongoDB              Flexible NoSQL database for efficient user data management.

📸 Project Gallery
Hero
<img width="1900" height="952" alt="image" src="https://github.com/user-attachments/assets/bbfbe3aa-5fcd-4ac8-87c3-6521d05ab13d" />
Login
<img width="1905" height="946" alt="image" src="https://github.com/user-attachments/assets/6cac4299-ce07-42f3-ab9d-8b109684c0f4" />
Browse Dashboard
<img width="1897" height="949" alt="image" src="https://github.com/user-attachments/assets/b93cc886-6bf5-4e64-9eeb-14cef75c95d9" />

🛠 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Minh/NotNetflix.git
Setup Frontend:

Bash
cd notnetflix-frontend
npm install
npm run dev
API Configuration:
Navigate to src/app/browse/page.tsx and insert your TMDB API Key into the API_KEY variable.

👨‍💻 Author
Minh - Fullstack Developer

This project was developed as a major assignment for the Advanced Java Programming course.
