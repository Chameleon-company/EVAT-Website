const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = `${API_URL}/personalised-ev-insights`;

//Better comments needed

/**
 * Submit form to the backend
 * @param {Object} EvInsightsData - The feedback data containing name, email, and suggestion
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

//export const getMyInsights = async (userId, token) => {
export const getMyInsights = async (token) => {
    try {
    //const response = await fetch(`${baseUrl}/${userId}`, {
    const response = await fetch(`${baseUrl}/me`, {
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