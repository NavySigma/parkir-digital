import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, Link } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Simpan format data yang sama dengan sistem lama kita di localStorage
      const userData = {
        username: data.user.user_metadata.username || data.user.email,
        email: data.user.email,
        id: data.user.id
      };
      
      localStorage.setItem("account", JSON.stringify(userData));
      
      // Beri tahu navbar kalau login berhasil
      window.dispatchEvent(new Event("storage"));
      
      alert("Login berhasil!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Selamat Datang</h2>
        <p className="text-gray-500 mb-6 text-sm">Masuk untuk mengelola parkir Anda.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 mt-4 shadow-lg"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
