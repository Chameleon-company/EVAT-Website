const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = `${API_URL}/personalised-ev-insights`;

/**
 * Submit form to the backend
 * @param {Object} EvInsightsData - The feedback data containing 
      weekly_km,
      trip_length,  
      driving_frequency,
      driving_type,
      road_trips,
      car_ownership,
      fuel_efficiency,
      monthly_fuel_spend,
      home_charging,
      solar_panels,
      charging_preference,
      budget,
      priorities,
      postcode
 * @param {*} token - authorisation token for the API
 * @returns {Promise<Object>} - The response from the API
 */

export const submitInsights = async (EvInsightsData, token) => {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(EvInsightsData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    }
    catch (error) {
        //Change text
        console.error('Error submitting Insights:', error);
        throw error;
    }
};

/**
 * Get feedback by ID (Admin only)
 * @param {*} token - authorisation token for the API
 * @returns {Promise<Object>} - The response from the API
 */
export const getMyInsights = async (token) => {
    try {
    const response = await fetch(`${baseUrl}/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
    }
    catch (error) {
        console.error('Error fetching insight:', error);
        throw error;
    }
};