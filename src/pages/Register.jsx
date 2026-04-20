import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, Link } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) throw error;
      
      alert("Registrasi berhasil! Silakan cek email untuk verifikasi atau langsung login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Daftar Akun</h2>
        <p className="text-gray-500 mb-6 text-sm">Buat akun untuk mulai menggunakan Parkir Digital.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: rea_parkir"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-lg"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
