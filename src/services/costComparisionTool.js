const API_URL = import.meta.env.VITE_API_URL;

export const getCostComparison = async (payload, token) => {
  console.log('API_URL', API_URL);
  
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

// const API_URL = import.meta.env.VITE_API_URL;
// const baseUrl = `${API_URL}/predict`;

// /**
//  * Submit a review for a specific charger
//  * @param {Object} stationIDs - An array of one or more station IDs
//  * @param {string} token - JWT token for authentication
//  * @returns {Promise<Object>} - The response from the API
//  */
// export const getCostComparison = async (payload, token) => {
//     try {
//         const response = await fetch(`${baseUrl}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(payload)
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         return result;
//     } catch (error) {
//         console.error('Error getting charger congestion levels:', error);
//         throw error;
//     }
// };