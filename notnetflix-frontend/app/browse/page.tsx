"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 1. Giao thức Interface
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
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieCategories, setMovieCategories] = useState<MovieCategory[]>([]);
  const [billboardMovie, setBillboardMovie] = useState<Movie | null>(null);
  const [isBillboardPlaying, setIsBillboardPlaying] = useState(false);
  const [billboardTrailerUrl, setBillboardTrailerUrl] = useState<string | null>(null);

  // STATE CHO TÍNH NĂNG SEARCH
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  // STATE MỚI: Quản lý Trailer Video
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. KIỂM TRA ĐĂNG NHẬP (Đã fix lỗi ESLint)
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setUserEmail((currentEmail) => {
        if (!currentEmail) return storedEmail ?? "User";
        return currentEmail;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // 2. GỌI API LẤY PHIM THẬT & BANNER NGẪU NHIÊN
  useEffect(() => {
    const fetchAllMovies = async () => {
      const API_KEY = "8164c4444786b404dc111a603098cc0b"; 
      const endpoints = [
        { title: "Trending Now", url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&include_adult=false` },
        { title: "Action & Adventure", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&include_adult=false` },
        { title: "Comedy Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35&include_adult=false` },
        { title: "Scary Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27&include_adult=false` },
        { title: "Romance Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749&include_adult=false` },
      ];

      try {
        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            const res = await fetch(endpoint.url);
            const data = await res.json();
            return { title: endpoint.title, movies: data.results || [] };
          })
        );
        setMovieCategories(results);

        if (results[0].movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * results[0].movies.length);
          setBillboardMovie(results[0].movies[randomIndex]);
        }
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    fetchAllMovies();
  }, []);

  // 3. GỌI API TÌM KIẾM PHIM THEO TỪ KHÓA (Tích hợp bộ lọc từ khóa đen)
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    
    if (query === "") {
      setSearchResults([]);
      return;
    }

    // BỘ LỌC TỪ KHÓA (SAFE SEARCH)
    // Bạn có thể thêm bất kỳ từ nào bạn muốn chặn vào mảng này
    const blacklistedWords = ["adult", "sex", "porn", "erotic", "18+", "nsfw"];
    
    // Kiểm tra xem từ khóa gõ vào có chứa từ cấm không
    const isUnsafe = blacklistedWords.some(word => query.includes(word));

    if (isUnsafe) {
      setSearchResults([]); // Xóa kết quả
      return; // Chặn không cho gọi API
    }

    const delayDebounceFn = setTimeout(async () => {
      const API_KEY = "8164c4444786b404dc111a603098cc0b";
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&include_adult=false`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Lỗi tìm kiếm API:", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // CÁC HÀM HỖ TRỢ
  const slide = (sliderId: string, direction: "left" | "right") => {
    const slider = document.getElementById(sliderId);
    if (slider) {
      const scrollAmount = direction === "left" ? -window.innerWidth * 0.7 : window.innerWidth * 0.7;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  // HÀM LẤY TRAILER TỪ YOUTUBE (Đã ép lấy tiếng Anh)
  const playTrailer = async () => {
    if (!selectedMovie) return;
    
    setIsPlaying(true); 
    
    const API_KEY = "8164c4444786b404dc111a603098cc0b";
    try {
      // ĐÃ SỬA: Thêm &language=en-US vào cuối đường link
      const res = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/videos?api_key=${API_KEY}&language=en-US`);
      const data = await res.json();
      
      const trailer = data.results.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube");
      
      if (trailer) {
        setTrailerUrl(trailer.key); 
      } else {
        const fallbackVideo = data.results.find((vid: any) => vid.site === "YouTube");
        if (fallbackVideo) {
          setTrailerUrl(fallbackVideo.key);
        } else {
          alert("Xin lỗi, bộ phim này chưa có Trailer tiếng Anh trên hệ thống.");
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Lỗi lấy Trailer:", error);
      setIsPlaying(false);
    }
  };

  // HÀM LẤY TRAILER CHO BILLBOARD
  const playBillboardTrailer = async () => {
    if (!billboardMovie) return;
    setIsBillboardPlaying(true); 
    
    const API_KEY = "8164c4444786b404dc111a603098cc0b";
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${billboardMovie.id}/videos?api_key=${API_KEY}`);
      const data = await res.json();
      const allVideos = data.results || [];
      const englishVideos = allVideos.filter((vid: any) => vid.iso_639_1 === "en" && vid.site === "YouTube");
      
      let bestVideo = englishVideos.find((vid: any) => vid.type === "Trailer" && vid.official) 
        || englishVideos.find((vid: any) => vid.type === "Trailer")
        || (englishVideos.length > 0 ? englishVideos[0] : null);

      if (bestVideo) {
        setBillboardTrailerUrl(bestVideo.key); 
      } else {
        alert("Xin lỗi, bộ phim này chưa có video tiếng Anh trên hệ thống.");
        setIsBillboardPlaying(false);
      }
    } catch (error) {
      console.error("Lỗi lấy Trailer Billboard:", error);
      setIsBillboardPlaying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/90 to-transparent">
        <h1 onClick={() => router.push('/')} className="font-bebas text-3xl md:text-4xl font-bold tracking-wider cursor-pointer">
          <span className="text-white">NOT</span>
          <span className="text-red-600">NETFLIX</span>
        </h1>
        
        <div className="flex items-center gap-6">
          {/* THANH TÌM KIẾM (SEARCH BAR) MỚI */}
          <div className={`flex items-center bg-black/60 border transition-all duration-300 ${isSearchOpen ? 'border-white' : 'border-transparent'}`}>
            <span 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="text-xl cursor-pointer p-1"
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Phim, diễn viên, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent text-white outline-none transition-all duration-300 ${isSearchOpen ? 'w-48 px-2 opacity-100' : 'w-0 px-0 opacity-0'}`}
            />
          </div>

          <div className="relative group cursor-pointer py-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" className="w-8 h-8 rounded" />
            <div className="absolute right-0 top-10 hidden group-hover:flex flex-col bg-black/95 border border-gray-800 py-3 w-48 shadow-2xl">
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800 mb-2 truncate">{userEmail}</div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-left hover:bg-zinc-800 transition text-white">Sign out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* NẾU ĐANG TÌM KIẾM THÌ HIỆN LƯỚI PHIM, NẾU KHÔNG THÌ HIỆN TRANG CHỦ BÌNH THƯỜNG */}
      {searchQuery.length > 0 ? (
        <div className="pt-32 px-4 md:px-12 min-h-screen z-20 relative">
          <h2 className="text-2xl text-gray-400 mb-6">Kết quả tìm kiếm cho: &quot;{searchQuery}&quot;</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((movie, index) => {
              if (!movie.poster_path) return null; // Bỏ qua phim không có ảnh
              return (
                <img 
                  key={index} 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title || movie.name} 
                  onClick={() => openModal(movie)}
                  className="w-full h-auto object-cover rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                />
              );
            })}
          </div>
          {searchResults.length === 0 && (
            <p className="text-center text-gray-500 mt-10 text-xl">Không tìm thấy bộ phim nào phù hợp.</p>
          )}
        </div>
      ) : (
        <>
          {/* BILLBOARD THÔNG MINH (CÓ TRAILER BACKGROUND) */}
      <div className="relative h-[85vh] w-full z-10 overflow-hidden">
        {billboardMovie ? (
          <>
            {/* NẾU ĐANG BẤM PLAY THÌ HIỆN YOUTUBE LÀM NỀN */}
            {isBillboardPlaying && billboardTrailerUrl ? (
              <div className="absolute w-full h-full pointer-events-none">
                <iframe
                  className="w-full h-full scale-[1.35]" 
                  src={`https://www.youtube.com/embed/${billboardTrailerUrl}?autoplay=1&controls=0&mute=0&loop=1&playlist=${billboardTrailerUrl}&showinfo=0&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              /* NẾU CHƯA PLAY THÌ HIỆN ẢNH BÌA NHƯ CŨ */
              <div 
                style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${billboardMovie.backdrop_path}')` }}
                className="absolute w-full h-full bg-cover bg-top transition-all duration-1000"
              ></div>
            )}

            {/* CÁC LỚP PHỦ ĐEN ĐỂ LÀM NỔI CHỮ (Nằm đè lên trên cả ảnh và video) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>

            {/* THÔNG TIN PHIM */}
            <div className="absolute bottom-[25%] left-4 md:left-12 max-w-2xl z-20">
              <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl uppercase">{billboardMovie.title || billboardMovie.name}</h2>
              <p className="text-gray-200 text-lg mb-6 line-clamp-3 drop-shadow-md">{billboardMovie.overview}</p>
              <div className="flex gap-4">
                
                {/* NÚT PLAY/STOP DÀNH CHO BILLBOARD */}
                {isBillboardPlaying ? (
                  <button 
                    onClick={() => { setIsBillboardPlaying(false); setBillboardTrailerUrl(null); }} 
                    className="px-8 py-2 bg-white/30 text-white font-bold rounded hover:bg-white/50 transition text-lg backdrop-blur-sm"
                  >
                    ⏸ Stop
                  </button>
                ) : (
                  <button 
                    onClick={playBillboardTrailer} 
                    className="px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg"
                  >
                    ▶ Play
                  </button>
                )}

                <button onClick={() => openModal(billboardMovie)} className="px-8 py-2 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/90 transition text-lg">
                  ⓘ More Info
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full w-full bg-zinc-900 animate-pulse flex items-center justify-center text-gray-500">Loading Billboard...</div>
        )}
      </div>
      
          {/* CÁC HÀNG PHIM CÓ MŨI TÊN */}
          <div className="relative pb-24 -mt-20 z-20">
            {movieCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-8 px-4 md:px-12 relative group">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-2">{category.title}</h3>
                <div className="relative">
                  <div onClick={() => slide(`slider-${catIndex}`, "left")} className="absolute left-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80 rounded-r-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </div>
                  <div id={`slider-${catIndex}`} className="flex space-x-3 overflow-x-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
                    {category.movies.map((movie, index) => (
                      <img 
                        key={index} 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title || movie.name} 
                        onClick={() => openModal(movie)}
                        className="w-[140px] md:w-[220px] min-w-[140px] md:min-w-[220px] h-[200px] md:h-[320px] object-cover rounded-sm cursor-pointer relative transition-all duration-300 delay-150 hover:scale-125 hover:z-50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border hover:border-gray-500"
                      />
                    ))}
                  </div>
                  <div onClick={() => slide(`slider-${catIndex}`, "right")} className="absolute right-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80 rounded-l-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL THÔNG MINH */}
      {showModal && selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            {/* Nút X màu trắng nổi bật */}
            <button 
              onClick={() => {
                setShowModal(false);
                setIsPlaying(false); // Đóng modal thì tắt video luôn
                setTrailerUrl(null);
              }} 
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#181818]/80 rounded-full flex items-center justify-center text-white border border-gray-500 hover:bg-white hover:text-black transition"
            >
              ✕
            </button>
            
            <div className="relative h-[50vh] w-full bg-black">
              {/* NẾU BẤM PLAY THÌ HIỆN YOUTUBE TRAILER */}
              {isPlaying && trailerUrl ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=1&showinfo=0&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                // NẾU CHƯA BẤM THÌ HIỆN ẢNH BÌA NHƯ CŨ
                <>
                  <img src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`} alt="movie" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
                  <div className="absolute bottom-6 left-10">
                    <h2 className="text-4xl font-bold text-white mb-4">{selectedMovie.title || selectedMovie.name}</h2>
                    {/* GẮN HÀM PLAY VÀO NÚT NÀY */}
                    <button 
                      onClick={playTrailer}
                      className="px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg flex items-center gap-2"
                    >
                      <span>▶</span> Play Trailer
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-10 text-white">
              <div className="flex gap-3 text-sm mb-4 font-semibold text-green-500">
                <span>{Math.floor((selectedMovie.vote_average || 8) * 10)}% Match</span>
                <span className="text-white">{(selectedMovie.release_date || selectedMovie.first_air_date || "").substring(0, 4)}</span>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">{selectedMovie.overview || "Chưa có tóm tắt nội dung cho bộ phim này."}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CHUẨN NETFLIX */}
      <footer className="max-w-5xl mx-auto px-4 md:px-12 py-16 text-gray-500 text-sm mt-10 relative z-20">
        {/* Mạng xã hội */}
        <div className="flex gap-6 mb-6">
          <a href="https://www.facebook.com/lequangminh05/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
             <svg className="w-6 h-6 hover:text-white cursor-pointer transition" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
             </a>
          <a href="https://www.instagram.com/lathuroi_/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
            <svg className="w-6 h-6 hover:text-white cursor-pointer transition" fill="currentColor" viewBox="0 0 24 24"><path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"/><circle cx="16.806" cy="7.207" r="1.078"/><path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"/></svg>
          </a>
        </div>

        {/* Lưới các đường link */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="#" className="hover:underline">Audio Description</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Gift Cards</a>
          <a href="#" className="hover:underline">Media Center</a>
          <a href="#" className="hover:underline">Investor Relations</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Legal Notices</a>
          <a href="#" className="hover:underline">Cookie Preferences</a>
          <a href="#" className="hover:underline">Corporate Information</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>

        {/* Nút Service Code */}
        <button className="border border-gray-500 text-gray-500 px-2 py-1 mb-6 hover:text-white hover:border-white transition">
          Service Code
        </button>

        {/* Dòng chữ bản quyền cá nhân hóa */}
        <p className="text-xs">
          © 2026 NotNetflix. Built by Lê Quang Minh-2374802010310. 
        </p>
      </footer>
    </main>
  );
  
}