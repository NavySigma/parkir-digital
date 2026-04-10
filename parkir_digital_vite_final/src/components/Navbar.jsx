import { Link } from "react-router-dom";
import bikeIcon from "../assets/icons/bike-icon.png";
import { useEffect, useState } from "react";

const TMDB_API_KEY = "07be0d298f5ade234f186e9eeb86a3b8";

export default function Navbar() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();

      if (!data.success) throw new Error("Gagal request token");
      const requestToken = data.request_token;

      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:5173/auth/tmdb/callback`;
    } catch (err) {
      console.error(err);
      alert("Gagal login ke TMDB");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tmdb_session_id");
    setUser(null);
    window.location.href = "/";
  };

  const fetchAccountData = async (sessionId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/account?api_key=${TMDB_API_KEY}&session_id=${sessionId}`
    );
    const data = await res.json();

    if (data?.username) {
      let avatar_url = null;
      if (data.avatar?.tmdb?.avatar_path) {
        avatar_url = `https://image.tmdb.org/t/p/w200${data.avatar.tmdb.avatar_path}`;
      } else if (data.avatar?.gravatar?.hash) {
        avatar_url = `https://www.gravatar.com/avatar/${data.avatar.gravatar.hash}`;
      }

      setUser({
  username: data.username,
  avatar: avatar_url,
  tmdb_id: data.id, // ⬅️ penting
});
localStorage.setItem("account", JSON.stringify({
  username: data.username,
  avatar: avatar_url,
  tmdb_id: data.id,
}));
    }
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("tmdb_session_id");
    if (sessionId) fetchAccountData(sessionId);

    const handleLoginSuccess = (e) => {
      if (e.detail?.session_id) {
        fetchAccountData(e.detail.session_id);
      }
    };

    window.addEventListener("tmdb_login_success", handleLoginSuccess);

    return () =>
      window.removeEventListener("tmdb_login_success", handleLoginSuccess);
  }, []);

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <img src={bikeIcon} alt="logo" className="w-9 h-9" />
          <h1 className="text-xl font-bold text-gray-900">Parkir Digital</h1>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-primary">
            Home
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary">
            Contact
          </Link>

          {user ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md relative group cursor-pointer">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center uppercase">
                  {user.username[0]}
                </div>
              )}
              <span className="font-medium">{user.username}</span>

              <div className="absolute top-12 right-0 bg-white shadow-md rounded-md px-4 py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-2 bg-primary text-white rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
