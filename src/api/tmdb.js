const API_KEY = "07be0d298f5ade234f186e9eeb86a3b8";

export async function getTmdbAccount(session_id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${session_id}`
  );
  return await res.json();
}
