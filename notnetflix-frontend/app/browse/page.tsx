"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Billboard from "../components/Billboard";
import MovieRow from "../components/MovieRow";

// --- 1. INTERFACES ---
interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
}

interface MovieCategory {
  title: string;
  movies: Movie[];
}

export default function BrowsePage() {
  const router = useRouter();
  
  // --- 2. STATES ---
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieCategories, setMovieCategories] = useState<MovieCategory[]>([]);
  const [billboardMovie, setBillboardMovie] = useState<Movie | null>(null);
  const [isBillboardPlaying, setIsBillboardPlaying] = useState(false);
  const [billboardTrailerUrl, setBillboardTrailerUrl] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const API_KEY = "8164c4444786b404dc111a603098cc0b";

  // --- 3. LOGIC (FUNCTIONS) ---

  // Auth Check
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setUserEmail(storedEmail ?? "User");
    }
  }, [router]);

  // Fetch Movies Data
  useEffect(() => {
    const fetchAllMovies = async () => {
      const endpoints = [
        { title: "Trending Now", url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&include_adult=false` },
        { title: "Action & Adventure", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&include_adult=false` },
        { title: "Comedy Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35&include_adult=false` },
        { title: "Horror Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27&include_adult=false` },
        { title: "Romance Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749&include_adult=false` },
      ];
      try {
        const results = await Promise.all(
          endpoints.map(async (e) => {
            const res = await fetch(e.url);
            const data = await res.json();
            return { title: e.title, movies: data.results || [] };
          })
        );
        setMovieCategories(results);
        if (results[0].movies.length > 0) {
          setBillboardMovie(results[0].movies[Math.floor(Math.random() * 5)]);
        }
      } catch (err) { console.error("API Error:", err); }
    };
    fetchAllMovies();
  }, []);

  // --- SEARCH LOGIC WITH SAFE SEARCH FILTER ---
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    
    if (query === "") {
      setSearchResults([]);
      return;
    }

    // List of blocked words
    const blacklistedWords = ["adult", "sex", "porn", "erotic", "18+", "nsfw"];
    const isUnsafe = blacklistedWords.some(word => query.includes(word));

    if (isUnsafe) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&include_adult=false`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Search Error:", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const toggleMyList = async (movieId: number) => {
    try {
      const res = await fetch("http://localhost:8080/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, movieId })
      });
      if (res.ok) setFavorites(await res.json());
    } catch (err) { console.error("Toggle My List Error:", err); }
  };

  const playTrailer = async () => {
    if (!selectedMovie) return;
    setIsPlaying(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/videos?api_key=${API_KEY}&language=en-US`);
      const data = await res.json();
      const trailer = data.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) setTrailerUrl(trailer.key);
    } catch (err) { setIsPlaying(false); }
  };

  const playBillboardTrailer = async () => {
    if (!billboardMovie) return;
    setIsBillboardPlaying(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${billboardMovie.id}/videos?api_key=${API_KEY}`);
      const data = await res.json();
      const trailer = data.results.find((v: any) => v.site === "YouTube");
      if (trailer) setBillboardTrailerUrl(trailer.key);
    } catch (err) { setIsBillboardPlaying(false); }
  };

  const openModal = (movie: Movie) => { setSelectedMovie(movie); setShowModal(true); };
  const handleLogout = () => { localStorage.clear(); router.push("/"); };

  return (
    <main className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      <Navbar 
        userEmail={userEmail} 
        isSearchOpen={isSearchOpen} 
        setIsSearchOpen={setIsSearchOpen} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleLogout={handleLogout} 
      />

      {searchQuery.length > 0 ? (
        <div className="pt-32 px-4 md:px-12 min-h-screen relative z-20">
          <h2 className="text-2xl text-gray-400 mb-6">Search Results for: &quot;{searchQuery}&quot;</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((m, i) => m.poster_path && (
              <img 
                key={i} 
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                onClick={() => openModal(m)} 
                className="w-full h-auto object-cover rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50 hover:shadow-2xl" 
                alt={m.title} 
              />
            ))}
          </div>
          {searchResults.length === 0 && (
            <p className="text-center text-gray-500 mt-10 text-xl font-light">No movies found for your search.</p>
          )}
        </div>
      ) : (
        <>
          <Billboard 
            movie={billboardMovie} 
            isPlaying={isBillboardPlaying} 
            trailerUrl={billboardTrailerUrl} 
            onPlay={playBillboardTrailer} 
            onStop={() => { setIsBillboardPlaying(false); setBillboardTrailerUrl(null); }} 
            onMoreInfo={openModal} 
          />
          <div className="relative pb-24 -mt-20 z-20">
            {movieCategories.map((cat, i) => (
              <MovieRow key={i} title={cat.title} movies={cat.movies} onMovieClick={openModal} rowId={`slider-${i}`} />
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl animate-fade-in">
            <button 
              onClick={() => { setShowModal(false); setIsPlaying(false); setTrailerUrl(null); }} 
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full border border-gray-500 hover:bg-white hover:text-black transition"
            >
              ✕
            </button>
            <div className="relative h-[45vh] w-full bg-black">
              {isPlaying && trailerUrl ? (
                <iframe 
                  className="w-full h-full" 
                  src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=1&rel=0`} 
                  frameBorder="0" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                />
              ) : (
                <>
                  <img 
                    src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`} 
                    className="w-full h-full object-cover opacity-70" 
                    alt="backdrop" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
                  <div className="absolute bottom-6 left-10">
                    <h2 className="text-4xl font-bold mb-4 drop-shadow-xl">{selectedMovie.title || selectedMovie.name}</h2>
                    <div className="flex gap-4 items-center">
                      <button onClick={playTrailer} className="px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg flex items-center gap-2">
                        <span>▶</span> Play Trailer
                      </button>
                      <button 
                        onClick={() => toggleMyList(selectedMovie.id)} 
                        className="w-11 h-11 border-2 border-gray-400 bg-black/50 rounded-full flex items-center justify-center text-2xl hover:border-white hover:bg-white/20 transition"
                        title="Add to My List"
                      >
                        {favorites.includes(selectedMovie.id) ? "✓" : "+"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-8 text-white">
              <div className="flex gap-3 text-sm mb-4 font-semibold text-green-500">
                <span>{Math.floor((selectedMovie.vote_average || 8) * 10)}% Match</span>
                <span className="text-white">{(selectedMovie.release_date || selectedMovie.first_air_date || "").substring(0, 4)}</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">{selectedMovie.overview || "No description available for this title."}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 md:px-12 py-20 text-gray-500 text-sm mt-10 relative z-20">
        <div className="flex gap-6 mb-8">
          <p className="hover:text-white cursor-pointer transition">Facebook</p>
          <p className="hover:text-white cursor-pointer transition">Instagram</p>
          <p className="hover:text-white cursor-pointer transition">Twitter</p>
          <p className="hover:text-white cursor-pointer transition">Youtube</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <p className="hover:underline cursor-pointer">Audio Description</p>
          <p className="hover:underline cursor-pointer">Help Center</p>
          <p className="hover:underline cursor-pointer">Gift Cards</p>
          <p className="hover:underline cursor-pointer">Media Center</p>
          <p className="hover:underline cursor-pointer">Terms of Use</p>
          <p className="hover:underline cursor-pointer">Privacy</p>
          <p className="hover:underline cursor-pointer">Contact Us</p>
          <p className="hover:underline cursor-pointer">Corporate Information</p>
        </div>
        <button className="border border-gray-500 px-2 py-1 mb-6 hover:text-white hover:border-white transition">Service Code</button>
        <p className="text-xs font-light">
          © 2026 NotNetflix Project. Created by Lê Quang Minh - ID: 2374802010310.
        </p>
      </footer>
    </main>
  );
}