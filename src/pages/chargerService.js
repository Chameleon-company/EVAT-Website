export async function getChargers(user, params = {}) {
  const baseUrl = 'https://localhost:8080/api/chargers';
  const url = new URL(baseUrl);

  if (params.bbox) {
    url.searchParams.set('bbox', params.bbox.join(','));
  }

  // Use token from context or fallback to localStorage
  const ctxToken = user?.token;
  const lsToken = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser'))?.token; } catch { return null; }
  })();
  const token = ctxToken || lsToken;

  if (!token) {
    throw new Error('Unauthorized: missing access token.');
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized (401): invalid or expired token.');
    }
    throw new Error(`Error ${res.status}: Failed to fetch chargers`);
  }

  const data = await res.json();
  return data.data;
}
