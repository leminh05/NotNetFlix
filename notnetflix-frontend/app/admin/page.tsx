"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  status: string; // Thêm status vào interface
  favoriteMovies?: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. LÍNH GÁC FRONTEND & FETCH DATA
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "ADMIN") {
      router.push("/");
    } else {
      setIsAuthorized(true);
      setAdminEmail(email || "Admin");
      fetchUsers(role); 
    }
  }, [router]);

  // 2. HÀM LẤY DANH SÁCH USER
  const fetchUsers = async (adminRole: string) => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: { "Role": adminRole }
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Connection error:", error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 🌟 FUNCTION MỚI: TOGGLE BAN (Thay thế cho Delete)
  const handleToggleBan = async (id: string, currentStatus: string) => {
    const action = currentStatus === "BANNED" ? "ACTIVATE" : "BAN";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/status`, {
        method: "PUT",
        headers: { "Role": "ADMIN" }
      });
      
      if (res.ok) {
        fetchUsers("ADMIN"); // Load lại danh sách để cập nhật UI
      } else {
        alert("Action failed! Check your backend API.");
      }
    } catch (err) {
      alert("Update status failed!");
    }
  };

  // 4. HÀM ĐỔI QUYỀN (UPDATE LEVEL)
  const handleToggleRole = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/role`, {
        method: "PUT",
        headers: { "Role": "ADMIN" }
      });
      if (res.ok) {
        fetchUsers("ADMIN"); 
      }
    } catch (err) {
      alert("Update role failed!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // 5. LOGIC LỌC USER THEO EMAIL
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex font-sans">
      <aside className="w-64 bg-black border-r border-zinc-800 flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="font-bebas text-3xl font-bold tracking-wider">
            <span className="text-white">NOT</span>
            <span className="text-[#E50914]">NETFLIX</span>
            <span className="text-xs text-gray-400 block tracking-normal font-sans mt-1">ADMIN PORTAL</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center p-3 bg-zinc-800/50 text-white rounded border-l-4 border-[#E50914] transition font-semibold">
            User Administration
          </button>
          <button onClick={() => router.push('/browse')} className="w-full flex items-center p-3 text-gray-400 hover:bg-zinc-800/50 hover:text-white rounded transition text-left font-semibold">
            Back to Movies
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <p className="text-sm text-gray-400 mb-2 truncate">Logged: {adminEmail}</p>
          <button onClick={handleLogout} className="w-full py-2 bg-transparent border border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-white rounded transition text-sm">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold italic uppercase tracking-tighter">Portal Management</h2>
            <p className="text-gray-500 text-sm">Control portal access and user permission levels.</p>
          </div>
          <button onClick={() => fetchUsers("ADMIN")} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm font-medium transition border border-zinc-700">
            🔄 Refresh Data
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm uppercase tracking-wider">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-gray-500 font-bold mb-2">Total Contacts</h3>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-gray-500 font-bold mb-2">Admin Level</h3>
            <p className="text-3xl font-bold text-[#E50914]">{users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-gray-500 font-bold mb-2">System Status</h3>
            <p className="text-xl font-bold text-green-500 flex items-center mt-2 font-sans">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Operational
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20">
            <h3 className="text-md font-bold uppercase">Account Database</h3>
            <input 
              type="text" 
              placeholder="Search by email..." 
              className="bg-black border border-zinc-700 px-4 py-1.5 rounded text-sm outline-none focus:border-[#E50914] w-64 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-gray-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="p-4">No.</th>
                  <th className="p-4">Email / Identity</th>
                  <th className="p-4">Permission Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-zinc-800">
                {isLoadingUsers ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500 italic">Fetching data from server...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500">No records found.</td></tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-zinc-800/40 transition">
                      <td className="p-4 text-gray-600 font-mono text-xs">{index + 1}</td>
                      <td className="p-4 font-bold">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-tighter border ${
                          user.role === "ADMIN" 
                          ? "bg-red-900/20 text-[#E50914] border-[#E50914]/50" 
                          : "bg-zinc-800 text-gray-400 border-zinc-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase font-bold ${user.status === 'BANNED' ? 'text-red-500' : 'text-green-500'}`}>
                          {user.status === 'BANNED' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleRole(user.id)}
                          className="text-[10px] font-bold text-blue-400 hover:text-white border border-blue-400/30 hover:bg-blue-400 px-3 py-1.5 rounded transition"
                        >
                          UPDATE LEVEL
                        </button>
                        
                        {/* NÚT REVOKE ACCESS GIỜ ĐÃ THÀNH BAN/UNBAN LINH HOẠT */}
                        <button 
                          onClick={() => handleToggleBan(user.id, user.status)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded transition border ${
                            user.status === "BANNED" 
                            ? "bg-green-900/20 text-green-500 border-green-900/50 hover:bg-green-500 hover:text-white" 
                            : "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-600 hover:text-white"
                          }`}
                        >
                          {user.status === "BANNED" ? "ACTIVATE ACCESS" : "REVOKE ACCESS"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded flex gap-3 items-start">
            <span className="text-red-600 text-xs mt-0.5">Note:</span>
            <p className="text-[11px] text-gray-500 italic leading-relaxed font-sans">
                Permission levels control user tasks within the Portal. Granting Admin access allows management of global permissions. 
                Use <strong>Revoke Access</strong> to suspend accounts without deleting data. Use <strong>Activate Access</strong> to restore.
            </p>
        </div>
      </main>
    </div>
  );
}