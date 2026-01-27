const API_URL = import.meta.env.VITE_API_URL;

// Fetch chargers from API
// params.bbox is optional but helps with performance - format: [west, south, east, north]
// Requires auth token in user object
export async function getChargers(user, params = {}) {
  const baseUrl = `${API_URL}/chargers`;
  const url = new URL(baseUrl);

  if (params.bbox) {
    url.searchParams.set('bbox', params.bbox.join(','));
  }

  // Use token from context or fallback to localStorage
  const ctxToken = user?.token;
  const lsToken = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.token; } catch { return null; }
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

export async function getConnectorTypes(user, params = {}) {
  try {
    const chargers = await getChargers(user, params);
    // Grab unique types from chargers array
  const uniqueTypes = [
    ...new Set(
      chargers
        .flatMap(charger => charger.connection_type.split(',').map(t => t.trim()))
    )
  ];
  return uniqueTypes;
  } catch (err) {
    console.error("Error fetching charger types:", err);
    return [];
  }
}

export async function getOperatorTypes(user, params = {}) {
  try {
    const chargers = await getChargers(user, params);

    // Normalisation rules
    const normaliseOperator = (op) => {
      if (!op) return "Unknown";

      const lower = op.toLowerCase().trim();

      // Tesla group
      if (lower.includes("tesla")) {
        return "Tesla";
      }

      // Evie group
      if (lower.includes("evie")) {
        return "Evie";
      }

      // Pulse group
      if (lower.includes("pulse")) {
        return "BP Pulse";
      }

      // Ampcharge group
      if (lower.includes("ampcharge")) {
        return "Ampol Ampcharge";
      }

      // NRMA group
      if (lower.includes("nrma")) {
        return "NRMA";
      }  

      // Unknown group
      if (lower.includes("unknown")) {
        return "Unknown";
      }
      return op.trim();
    };

    // Count operators after normalisation
    const counts = chargers.reduce((acc, charger) => {
      // Use the entire operator string, or default to "Unknown"
      const op = charger.operator ? normaliseOperator(charger.operator) : "Unknown";

      acc[op] = (acc[op] || 0) + 1;
      return acc;
    }, {});

    // Separate big groups vs "Other"
    const threshold = 30; // big groups have more chargers than this number
    const bigGroups = Object.entries(counts)
      .filter(([_, count]) => count >= threshold)
      .map(([op]) => op);

    const uniqueTypes = [
      ...bigGroups,
      "Other"
    ];
    
    return uniqueTypes;
  } catch (err) {
    console.error("Error fetching operator types:", err);
    return [];
  }
}