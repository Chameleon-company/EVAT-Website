const API_URL = import.meta.env.VITE_API_URL;

export const getCostComparison = async (payload, token) => {
  const response = await fetch(`${API_URL}/predict/cost`, { 
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

export const getCostCharts = async (payload, token) => {
    const response = await fetch(`${API_URL}/predict/cost/charts`, {
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

export const getEvVehicles = async (token) => {
    const response = await fetch(`${API_URL}/predict/vehicles/ev`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

export const getIceVehicles = async (token) => {
    const response = await fetch(`${API_URL}/predict/vehicles/ice`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

export const getEvEfficiency = async (make, model, variant, token) => {
    const response = await fetch(`${API_URL}/predict/vehicles/ev/efficiency`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ make, model, variant }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

export const getIceEfficiency = async (make, model, variant, token) => {
    const response = await fetch(`${API_URL}/predict/vehicles/ice/efficiency`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ make, model, variant }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};