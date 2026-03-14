"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

export default function Home() {
  const router = useRouter();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  // Gọi API lấy 6 phim Trending cho trang chủ
  useEffect(() => {
    const fetchTrending = async () => {
      const API_KEY = "8164c4444786b404dc111a603098cc0b"; 
      try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await res.json();
        // Chỉ lấy 6 bộ phim đầu tiên
        setTrendingMovies(data.results?.slice(0, 6) || []);
      } catch (error) {
        console.error("Lỗi lấy phim trang chủ:", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full p-6 md:px-16 flex items-center justify-between z-50">
        <h1 className="font-bebas text-4xl md:text-5xl font-bold tracking-wider cursor-pointer drop-shadow-md">
          <span className="text-white">NOT</span><span className="text-red-600">NETFLIX</span>
        </h1>
        <button 
          onClick={() => router.push('/login')}
          className="px-4 py-1.5 md:px-6 md:py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </nav>

      {/* HERO BANNER */}
      <div 
        className="relative h-[85vh] w-full bg-cover bg-center flex flex-col justify-center px-6 md:px-16"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>

        <div className="relative z-20 max-w-2xl mt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl uppercase">
            Unlimited movies, TV shows, and more
            </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-6 line-clamp-3 drop-shadow-md max-w-2xl">
            Watch anywhere. Cancel anytime. Dive into a world of endless entertainment and discover your next favorite story today.
            </p>
          
          <div className="flex space-x-4">
            <button onClick={() => router.push('/login')} className="flex items-center justify-center px-6 py-2 md:px-8 md:py-3 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg">
              <span className="mr-2 text-2xl">▶</span> Play
            </button>
            <button onClick={() => router.push('/login')} className="flex items-center justify-center px-6 py-2 md:px-8 md:py-3 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/90 transition text-lg">
              <span className="mr-2 text-2xl">ⓘ</span> More Info
            </button>
          </div>
        </div>
      </div>

      {/* MOVIE ROWS (Dữ liệu thật từ API) */}
      <div className="relative z-20 pb-20 -mt-24 px-6 md:px-16">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 drop-shadow-md">Trending Now</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {trendingMovies.length > 0 ? (
            trendingMovies.map((movie) => (
              <div 
                key={movie.id} 
                onClick={() => router.push('/login')}
                className="min-w-[150px] h-[225px] md:min-w-[200px] md:h-[300px] relative group overflow-hidden rounded-md hover:scale-105 transition duration-300 cursor-pointer border border-zinc-700 shadow-lg"
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {/* Lớp phủ đen mờ hiện tên phim khi rê chuột vào */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-bold truncate">{movie.title || movie.name}</p>
                </div>
              </div>
            ))
          ) : (
            // Hiện 6 ô trống mờ ảo trong lúc chờ tải dữ liệu
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="min-w-[150px] h-[225px] md:min-w-[200px] md:h-[300px] bg-zinc-800 animate-pulse rounded-md"></div>
            ))
          )}
        </div>
      </div>
      
    </main>
  );
}