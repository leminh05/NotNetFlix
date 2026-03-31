"use client";
interface MovieRowProps {
  title: string;
  movies: any[];
  onMovieClick: (movie: any) => void;
  rowId: string;
}

export default function MovieRow({ title, movies, onMovieClick, rowId }: MovieRowProps) {
  const slide = (direction: "left" | "right") => {
    const slider = document.getElementById(rowId);
    if (slider) {
      const scrollAmount = direction === "left" ? -window.innerWidth * 0.7 : window.innerWidth * 0.7;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 px-4 md:px-12 relative group">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-2">{title}</h3>
      <div className="relative">
        <div onClick={() => slide("left")} className="absolute left-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80 rounded-r-md">
          <span className="text-white text-3xl font-bold">‹</span>
        </div>
        <div id={rowId} className="flex space-x-3 overflow-x-auto py-6 [&::-webkit-scrollbar]:hidden scroll-smooth">
          {movies.map((movie, index) => (
            movie.poster_path && (
              <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} onClick={() => onMovieClick(movie)}
                className="w-[140px] md:w-[220px] min-w-[140px] md:min-w-[220px] h-[200px] md:h-[320px] object-cover rounded-sm cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50 hover:shadow-2xl border border-transparent hover:border-gray-500" />
            )
          ))}
        </div>
        <div onClick={() => slide("right")} className="absolute right-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80 rounded-l-md">
          <span className="text-white text-3xl font-bold">›</span>
        </div>
      </div>
    </div>
  );
}