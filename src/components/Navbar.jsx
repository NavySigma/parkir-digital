import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("account");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Listen for login/logout events
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("account");
      setUser(null);
      navigate("/");
      // Refresh status di komponen lain
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
        PARKIR<span className="text-blue-600">DIGITAL</span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          {user && <Link to="/qrcode" className="hover:text-gray-900 transition-colors">Tiket Saya</Link>}
        </div>

        <div className="h-6 w-px bg-gray-100 hidden md:block"></div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Logged in as</p>
              <p className="text-sm font-black text-gray-900 leading-none mt-1">{user.username}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login"
              className="px-6 py-2 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
