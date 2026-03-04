export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      
      {/* 1. NAVBAR (Thanh điều hướng) */}
      <nav className="absolute top-0 w-full p-6 md:px-16 flex items-center justify-between z-50">
        <h1 className="font-bebas text-4xl md:text-5xl tracking-wider cursor-pointer drop-shadow-md">
          <span className="text-white">NOT</span><span className="text-red-600">NETFLIX</span>
        </h1>
        <button className="px-4 py-1.5 md:px-6 md:py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition">
          Sign In
        </button>
      </nav>

      {/* 2. HERO BANNER (Khu vực nổi bật) */}
      <div className="relative h-[85vh] w-full bg-zinc-900 flex flex-col justify-center px-6 md:px-16">
        {/* Các lớp Gradient để tạo hiệu ứng tối dần (Vignette) giống Netflix */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

        {/* Nội dung chữ của Banner */}
        <div className="relative z-20 max-w-2xl mt-20">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl">
            SPRING BOOT <br /> IN ACTION
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md font-light">
            Watch the most thrilling backend architecture come to life. Build robust APIs, handle HLS video streaming, and scale your application to the top.
          </p>
          
          {/* Cụm nút Play và More Info */}
          <div className="flex space-x-4">
            <button className="flex items-center justify-center px-6 py-2 md:px-8 md:py-3 bg-white text-black font-bold rounded hover:bg-gray-300 transition text-lg">
              <span className="mr-2 text-2xl">▶</span> Play
            </button>
            <button className="flex items-center justify-center px-6 py-2 md:px-8 md:py-3 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/90 transition text-lg">
              <span className="mr-2 text-2xl">ⓘ</span> More Info
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOVIE ROWS (Hàng danh sách phim) */}
      <div className="relative z-20 pb-20 -mt-24 px-6 md:px-16">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 drop-shadow-md">Trending Now</h3>
        
        {/* Khung cuộn ngang chứa các poster phim */}
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* Dùng vòng lặp tạo tạm 6 cái ô vuông giả làm poster phim */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="min-w-[150px] h-[225px] md:min-w-[200px] md:h-[300px] bg-zinc-800 rounded-md hover:scale-105 transition duration-300 cursor-pointer border border-zinc-700 shadow-lg"
            >
            </div>
          ))}
        </div>
      </div>
      
    </main>
  );
}