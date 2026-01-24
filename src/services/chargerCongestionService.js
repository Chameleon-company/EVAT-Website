const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = `${API_URL}/predict`;

/**
 * Submit a review for a specific charger
 * @param {Object} stationIDs - An array of one or more station IDs
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const getChargerCongestion = async (stationIDs, token) => {
    try {
        const response = await fetch(`${baseUrl}/congestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "stationIds": stationIDs
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error getting charger congestion levels:', error);
        throw error;
    }
};