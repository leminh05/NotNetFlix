"use client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userEmail: string;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleLogout: () => void;
}

export default function Navbar({ userEmail, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, handleLogout }: NavbarProps) {
  const router = useRouter();
  return (
    <nav className="fixed w-full z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/90 to-transparent transition-all duration-500">
      <div className="flex items-center gap-10">
        <h1 onClick={() => router.push('/browse')} className="font-bebas text-3xl md:text-4xl font-bold tracking-wider cursor-pointer">
          <span className="text-white">NOT</span><span className="text-red-600">NETFLIX</span>
        </h1>
        <div className="hidden md:flex items-center gap-6 text-sm font-light">
          <p onClick={() => router.push('/browse')} className="cursor-pointer hover:text-gray-300 transition">Home</p>
          <p onClick={() => router.push('/my-list')} className="cursor-pointer hover:text-gray-300 transition">My List</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className={`flex items-center bg-black/60 border transition-all duration-300 ${isSearchOpen ? 'border-white' : 'border-transparent'}`}>
          <span onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-xl cursor-pointer p-1">🔍</span>
          <input type="text" placeholder="Movies, actors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent text-white outline-none transition-all duration-300 ${isSearchOpen ? 'w-48 px-2 opacity-100' : 'w-0 px-0 opacity-0'}`} />
        </div>
        <div className="relative group cursor-pointer py-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" className="w-8 h-8 rounded" />
          <div className="absolute right-0 top-10 hidden group-hover:flex flex-col bg-black/95 border border-gray-800 py-3 w-48 shadow-2xl transition-all">
            <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800 mb-2 truncate">{userEmail}</div>
            <button onClick={() => router.push('/admin')} className="px-4 py-2 text-sm text-left hover:bg-zinc-800 transition">Admin Portal</button>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-left hover:bg-zinc-800 transition">Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}