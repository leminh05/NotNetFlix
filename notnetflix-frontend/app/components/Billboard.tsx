"use client";
interface BillboardProps {
  movie: any;
  isPlaying: boolean;
  trailerUrl: string | null;
  onPlay: () => void;
  onStop: () => void;
  onMoreInfo: (movie: any) => void;
}

export default function Billboard({ movie, isPlaying, trailerUrl, onPlay, onStop, onMoreInfo }: BillboardProps) {
  if (!movie) return <div className="h-[85vh] w-full bg-zinc-900 animate-pulse" />;

  return (
    <div className="relative h-[85vh] w-full z-10 overflow-hidden">
      {isPlaying && trailerUrl ? (
        <iframe className="w-full h-full scale-[1.35] absolute pointer-events-none" 
          src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=0&mute=0&loop=1&playlist=${trailerUrl}&showinfo=0&rel=0`} frameBorder="0" allow="autoplay; encrypted-media" />
      ) : (
        <div style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')` }} className="absolute w-full h-full bg-cover bg-top" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      <div className="absolute bottom-[25%] left-4 md:left-12 max-w-2xl z-20">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 uppercase drop-shadow-2xl">{movie.title || movie.name}</h2>
        <p className="text-gray-200 text-lg mb-6 line-clamp-3 drop-shadow-md">{movie.overview}</p>
        <div className="flex gap-4">
          <button onClick={isPlaying ? onStop : onPlay} className={`px-8 py-2 font-bold rounded transition text-lg ${isPlaying ? 'bg-white/30 text-white backdrop-blur-sm' : 'bg-white text-black'}`}>
            {isPlaying ? "⏸ Stop" : "▶ Play"}
          </button>
          <button onClick={() => onMoreInfo(movie)} className="px-8 py-2 bg-gray-500/70 text-white font-bold rounded transition text-lg">ⓘ More Info</button>
        </div>
      </div>
    </div>
  );
}