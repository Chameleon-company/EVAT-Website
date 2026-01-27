const API_URL = import.meta.env.VITE_API_URL;

export const getCostComparison = async (payload, token) => {
  // This is just to run on local machine. When API is deploy globally then it should be changed.
  // const response = await fetch(`${API_URL}/predict`, {
  const response = await fetch(`http://127.0.0.1:8000/predict`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};