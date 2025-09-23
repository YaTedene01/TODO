// Utilitaire pour les appels API backend
const API_URL = 'http://localhost:3010';  

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  // Remplace /me par /:id si présent dans le path
  if (path === '/api/user/me' && userId) {
    path = `/api/user/${userId}`;
  }
  let headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  // Si body est FormData, ne pas mettre Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}
