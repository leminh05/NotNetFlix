"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar"; 

export default function MyListPage() {
  const router = useRouter();
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // States for the synchronized Navbar
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const API_KEY = "8164c4444786b404dc111a603098cc0b";

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (!loggedIn || !email) {
      router.push("/login");
      return;
    }
    setUserEmail(email);

    const fetchFavorites = async () => {
      try {
        // 1. Fetch favorite IDs from your Spring Boot Backend
        const res = await fetch(`http://localhost:8080/api/users/favorites/${email}`);
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const movieIds = await res.json();

        // 2. Fetch detailed movie info from TMDB for each ID
        const movieDetails = await Promise.all(
          movieIds.map(async (id: number) => {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
            );
            return tmdbRes.json();
          })
        );

        setFavoriteMovies(movieDetails.filter(m => m.id)); 
      } catch (err) {
        console.error("Error loading My List:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Redirect to browse if user starts searching in My List
  useEffect(() => {
    if (searchQuery.length > 0) {
      router.push(`/browse?search=${searchQuery}`);
    }
  }, [searchQuery, router]);

  return (
    <div className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      <Navbar 
        userEmail={userEmail} 
        isSearchOpen={isSearchOpen} 
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
      />

      <main className="px-4 md:px-12 pt-32 pb-10">
        <h1 className="text-3xl font-bold mb-8 drop-shadow-md">My List</h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 animate-pulse text-xl font-light">Loading your favorites...</p>
          </div>
        ) : favoriteMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-xl mb-4">You haven't added any movies to your list yet.</p>
            <button 
              onClick={() => router.push('/browse')}
              className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favoriteMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="group relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-50"
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="rounded-md shadow-lg border border-transparent group-hover:border-gray-500 w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 rounded-md">
                   <p className="text-xs font-bold truncate">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
        © 2026 NotNetflix. Built by Lê Quang Minh-2374802010310.
      </footer>
    </div>
  );
}