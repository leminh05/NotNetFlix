"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BrowsePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  
  // 1. STATE CHO BẢNG THÔNG TIN (MODAL) THÔNG MINH
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null); // Lưu thông tin phim được bấm vào
  
  // 2. STATE CHỨA NHIỀU THỂ LOẠI PHIM
  const [movieCategories, setMovieCategories] = useState<any[]>([]);

  // KIỂM TRA BẢO MẬT
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    
    if (!loggedIn) {
      router.push("/login");
    } else if (userEmail === "") {
      setUserEmail(email ?? "User");
    }
  }, [router, userEmail]);

  // GỌI API LẤY 5 THỂ LOẠI PHIM CÙNG LÚC
  useEffect(() => {
    const fetchAllMovies = async () => {
      // 👉 BẠN HÃY DÁN API KEY CỦA BẠN VÀO ĐÂY:
      const API_KEY = "8164c4444786b404dc111a603098cc0b"; 
      
      const endpoints = [
        { title: "Trending Now", url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}` },
        { title: "Action & Adventure", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28` },
        { title: "Comedy Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35` },
        { title: "Scary Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27` },
        { title: "Romance Movies", url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749` },
      ];

      try {
        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            const res = await fetch(endpoint.url);
            const data = await res.json();
            return {
              title: endpoint.title,
              movies: data.results || []
            };
          })
        );
        setMovieCategories(results);
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      }
    };

    fetchAllMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  // Hàm kích hoạt khi người dùng bấm vào một Poster phim
  const openModal = (movie: any) => {
    setSelectedMovie(movie); // Nạp dữ liệu phim đó vào
    setShowModal(true);      // Bật modal lên
  };
  // Hàm điều khiển vuốt mũi tên để cuộn hàng phim sang trái hoặc phải
  const slide = (sliderId: string, direction: "left" | "right") => {
    const slider = document.getElementById(sliderId);
    if (slider) {
      // Mỗi lần bấm sẽ cuộn một khoảng bằng 70% chiều rộng màn hình hiện tại
      const scrollAmount = direction === "left" ? -window.innerWidth * 0.7 : window.innerWidth * 0.7;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-8">
          <h1 onClick={() => router.push('/')} className="font-bebas text-3xl md:text-4xl font-bold tracking-wider cursor-pointer">
            <span className="text-white">NOT</span>
            <span className="text-red-600">NETFLIX</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-xl cursor-pointer">🔍</span>
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" className="w-8 h-8 rounded" />
            </div>
            <div className="absolute right-0 top-10 hidden group-hover:flex flex-col bg-black/95 border border-gray-800 py-3 w-48 shadow-2xl">
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800 mb-2 truncate">
                {userEmail}
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-left hover:bg-zinc-800 transition text-white">
                Sign out of NotNetflix
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* BILLBOARD (DUNE) */}
      <div className="relative h-[85vh] w-full z-10">
        <div className="absolute w-full h-full bg-[url('https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg')] bg-cover bg-top">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-[25%] left-4 md:left-12 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">DUNE: PART TWO</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg">
              ▶ Play
            </button>
            <button className="flex items-center gap-2 px-8 py-2 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/90 transition text-lg">
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      {/* CÁC HÀNG PHIM */}
      <div className="relative pb-24 -mt-20 z-20">
        {movieCategories.map((category, catIndex) => (
          // Đã thêm class 'group' để nhận diện khi chuột rê vào hàng phim
          <div key={catIndex} className="mb-8 px-4 md:px-12 relative group">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-2">{category.title}</h3>
            
            <div className="relative">
              {/* NÚT MŨI TÊN TRÁI (Tàng hình, chỉ hiện khi rê chuột) */}
              <div 
                onClick={() => slide(`slider-${catIndex}`, "left")}
                className="absolute left-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-black/80 rounded-r-md"
              >
                {/* Icon mũi tên trái */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>

              {/* DANH SÁCH PHIM */}
              <div 
                id={`slider-${catIndex}`} 
                className="flex space-x-3 overflow-x-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
              >
                {category.movies.map((movie: any, index: number) => {
                  if (!movie.poster_path) return null;
                  return (
                    <img 
                      key={index} 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title || movie.name} 
                      onClick={() => openModal(movie)}
                      // Đã thêm min-w-[...] để tránh lỗi bị bóp méo ảnh khi flexbox co lại
                      className="w-[140px] md:w-[220px] min-w-[140px] md:min-w-[220px] h-[200px] md:h-[320px] object-cover rounded-sm cursor-pointer relative transition-all duration-300 delay-150 hover:scale-125 hover:z-50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border hover:border-gray-500"
                    />
                  );
                })}
              </div>

              {/* NÚT MŨI TÊN PHẢI (Tàng hình, chỉ hiện khi rê chuột) */}
              <div 
                onClick={() => slide(`slider-${catIndex}`, "right")}
                className="absolute right-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-black/80 rounded-l-md"
              >
                {/* Icon mũi tên phải */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* DYNAMIC MODAL POP-UP (BẢNG THÔNG TIN THÔNG MINH) */}
      {showModal && selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition cursor-pointer">✕</button>
            
            <div className="relative h-[50vh] w-full bg-black">
              {/* Lấy ảnh ngang (backdrop) của phim được chọn, nếu không có thì lấy ảnh dọc */}
              <img 
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`} 
                alt={selectedMovie.title || selectedMovie.name} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
              <div className="absolute bottom-6 left-10">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-xl shadow-black">
                  {selectedMovie.title || selectedMovie.name}
                </h2>
                <button className="flex items-center gap-2 px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg">▶ Play</button>
              </div>
            </div>

            <div className="p-10 text-white flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3">
                <div className="flex gap-3 text-sm mb-4 font-semibold">
                  <span className="text-green-500">{Math.floor((selectedMovie.vote_average || 8) * 10)}% Match</span>
                  <span>{(selectedMovie.release_date || selectedMovie.first_air_date || "").substring(0, 4)}</span>
                  <span className="border border-gray-600 px-1 rounded text-xs text-gray-400">HD</span>
                </div>
                {/* Lấy tóm tắt phim được chọn */}
                <p className="text-lg text-gray-300 leading-relaxed">
                  {selectedMovie.overview || "Chưa có tóm tắt nội dung cho bộ phim này."}
                </p>
              </div>
              <div className="w-full md:w-1/3 text-sm text-gray-400 flex flex-col gap-2">
                <p><span className="text-gray-500">Lượt đánh giá:</span> {selectedMovie.vote_count}</p>
                <p><span className="text-gray-500">Ngôn ngữ gốc:</span> {selectedMovie.original_language?.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}