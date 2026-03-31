"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Lắng nghe sự kiện scroll để thay đổi trạng thái isScrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-colors duration-500 flex items-center justify-between p-4 md:px-16 ${
        isScrolled ? "bg-[#141414] shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {/* Logo bên trái */}
      <div className="flex items-center gap-8">
        <h1 
          onClick={() => router.push('/browse')} 
          className="font-bebas text-3xl md:text-4xl font-bold tracking-wider cursor-pointer"
        >
          <span className="text-white">NOT</span>
          <span className="text-[#E50914]">NETFLIX</span>
        </h1>
        
        {/* Menu điều hướng ẩn trên mobile, hiện trên màn hình lớn */}
        <nav className="hidden md:flex gap-5 text-sm">
          <span className="text-white font-medium cursor-pointer">Home</span>
          <span className="text-gray-300 hover:text-white transition cursor-pointer">TV Shows</span>
          <span className="text-gray-300 hover:text-white transition cursor-pointer">Movies</span>
          <span className="text-gray-300 hover:text-white transition cursor-pointer">My List</span>
        </nav>
      </div>

      {/* Cụm Avatar và Đăng xuất bên phải */}
      <div className="flex items-center gap-4">
        <svg className="w-6 h-6 text-white cursor-pointer hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <div className="relative group cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            U
          </div>
          {/* Menu Dropdown hiện ra khi hover */}
          <div className="absolute right-0 top-8 mt-2 w-32 bg-black border border-zinc-800 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}