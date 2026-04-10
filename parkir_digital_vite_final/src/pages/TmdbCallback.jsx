import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TMDB_API_KEY = "07be0d298f5ade234f186e9eeb86a3b8";

export default function TmdbCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const requestToken = url.searchParams.get("request_token");
    const denied = url.searchParams.get("denied");

    if (denied) {
      navigate("/?error=access_denied");
      return;
    }

    async function createSession() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/authentication/session/new?api_key=${TMDB_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ request_token: requestToken }),
          }
        );
        const data = await res.json();

        if (!data.success) {
          navigate("/?error=session_failed");
          return;
        }

        localStorage.setItem("tmdb_session_id", data.session_id);

        // ✅ langsung dispatch event ke Navbar
        window.dispatchEvent(
          new CustomEvent("tmdb_login_success", {
            detail: { session_id: data.session_id },
          })
        );
        

        navigate("/");
      } catch (err) {
        navigate("/?");
      }
    }

    if (requestToken) createSession();
    else navigate("/?error=request_token_missing");
  }, [navigate]);

  return <p>Memproses login...</p>;
}
