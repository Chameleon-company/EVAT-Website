const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = `${API_URL}/charger-reviews`;
const usernameUrl = `${API_URL}/profile/username`;

/**
 * Submit a review for a specific charger
 * @param {Object} reviewData - The review data containing chargerId, rating, comment
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const submitChargerReview = async (reviewData, token) => {
  try {
    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting charger review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a specific charger
 * @param {string} chargerId - The charger ID
 * @param {Object} options - Query options like page, limit
 * @returns {Promise<Object>} - The response from the API
 */
export const getChargerReviews = async (chargerId, options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${baseUrl}/charger/${chargerId}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching charger reviews:', error);
    throw error;
  }
};


/**
 * Get charger review statistics (average rating, total reviews)
 * @param {string} chargerId - The charger ID
 * @returns {Promise<Object>} - The response from the API
 */
export const getChargerReviewStats = async (chargerId) => {
  try {
    const response = await fetch(`${baseUrl}/charger/${chargerId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching charger review stats:', error);
    throw error;
  }
};

/**
 * Check if user has reviewed a charger and get their review
 * @param {string} chargerId - The charger ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const checkUserReviewStatus = async (chargerId, token) => {
  try {
    const response = await fetch(`${baseUrl}/charger/${chargerId}/user-status`, {
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
  } catch (error) {
    console.error('Error checking user review status:', error);
    throw error;
  }
};

/**
 * Update a user's review for a charger
 * @param {string} reviewId - The review ID
 * @param {Object} reviewData - The updated review data
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const updateChargerReview = async (reviewId, reviewData, token) => {
  try {
    const response = await fetch(`${baseUrl}/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating charger review:', error);
    throw error;
  }
};

/**
 * Delete a user's review for a charger
 * @param {string} reviewId - The review ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const deleteChargerReview = async (reviewId, token) => {
  try {
    const response = await fetch(`${baseUrl}/${reviewId}`, {
      method: 'DELETE',
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
  } catch (error) {
    console.error('Error deleting charger review:', error);
    throw error;
  }
};

/**
 * Get username from ID 
 * @param {string} userID - The user ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - The response from the API
 */
export const getUsername = async (userID, token) => {
  try {
    const response = await fetch(`${usernameUrl}/${userID}`, {
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
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error;
  }
};
