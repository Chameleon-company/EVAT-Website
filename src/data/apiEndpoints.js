// src/data/apiEndpoints.js
// edit, add, remove, or group endpoints here!

const userAuth = [
  // ==================== USER AUTH ====================
  { method: 'POST', endpoint: '/auth/register',                label: 'Register new user' },
  { method: 'POST', endpoint: '/auth/login',                   label: 'Login' },
  { method: 'POST', endpoint: '/auth/refresh-token',           label: 'Refresh access token' },
  { method: 'GET',  endpoint: '/auth/profile',                 label: 'Get user profile' },
  { method: 'PUT',  endpoint: '/auth/profile',                 label: 'Update user profile' },
];

const adminAuth = [
  // ==================== ADMIN AUTH (2FA) ====================
  { method: 'POST', endpoint: '/admin-auth/login',             label: 'Admin login (step 1)' },
  { method: 'POST', endpoint: '/admin-auth/verify-2fa',        label: 'Admin 2FA verification' },
  { method: 'PUT',  endpoint: '/admin-auth/update-credentials', label: 'Update admin credentials' },
];

const profile = [
  // ==================== PROFILE ====================
  { method: 'GET',  endpoint: '/profile/user-profile',         label: 'Get full user profile' },
  { method: 'POST', endpoint: '/profile/vehicle-model',        label: 'Update vehicle model' },
  { method: 'POST', endpoint: '/profile/add-favourite-station', label: 'Add favourite station' },
  { method: 'POST', endpoint: '/profile/remove-favourite-station', label: 'Remove favourite station' },
];

const vehicles = [
  // ==================== VEHICLES ====================
  { method: 'GET',  endpoint: '/vehicle',                      label: 'Get all vehicles' },
  { method: 'GET',  endpoint: '/vehicle/{vehicleId}',          label: 'Get vehicle by ID' },
];

const chargeStations = [
  // ==================== CHARGERS / STATIONS ====================
  { method: 'GET',  endpoint: '/chargers',                     label: 'Get all chargers' },
  { method: 'GET',  endpoint: '/chargers/nearest-charger',     label: 'Get nearest charger' },
  { method: 'GET',  endpoint: '/chargers/{stationId}',         label: 'Get charger by station ID' },
  { method: 'GET',  endpoint: '/chargers/GoogleMapsChargers',  label: 'Get Google Maps chargers' },
  { method: 'POST', endpoint: '/altchargers/nearby',           label: 'Find nearby chargers (alt)' },
];

const chargerSessions = [
  // ==================== CHARGER SESSIONS ====================
  { method: 'GET',    endpoint: '/charger-sessions/{sessionId}',       label: 'Get session by ID' },
  { method: 'GET',    endpoint: '/charger-sessions/user/{userId}',     label: 'Get user sessions' },
  { method: 'GET',    endpoint: '/charger-sessions/station/{stationId}', label: 'Get station sessions' },
  { method: 'POST',   endpoint: '/charger-sessions/',                  label: 'Start new session' },
  { method: 'PATCH',  endpoint: '/charger-sessions/end/{sessionId}',   label: 'End session' },
  { method: 'GET',    endpoint: '/charger-sessions/sessions/stream',   label: 'Live session stream (SSE)' },
];

const chargerReviews = [
  // ==================== CHARGER REVIEWS ====================
  { method: 'POST', endpoint: '/charger-reviews',                     label: 'Submit review' },
  { method: 'PUT',  endpoint: '/charger-reviews/{reviewId}',          label: 'Update review' },
  { method: 'DELETE', endpoint: '/charger-reviews/{reviewId}',        label: 'Delete review' },
  { method: 'GET',  endpoint: '/charger-reviews/charger/{chargerId}', label: 'Get reviews for charger' },
  { method: 'GET',  endpoint: '/charger-reviews/charger/{chargerId}/stats', label: 'Get rating stats' },
];

const navigation = [
  // ==================== NAVIGATION ====================
  { method: 'POST', endpoint: '/navigation/from-points',     label: 'Route from coordinates' },
  { method: 'POST', endpoint: '/navigation/from-sentence',   label: 'Route from address text' },
];

const feedback = [
  // ==================== FEEDBACK ====================
  { method: 'POST', endpoint: '/feedback/',                  label: 'Submit feedback' },
];

const adminOnly = [
  // ==================== ADMIN ONLY ====================
  { method: 'GET',    endpoint: '/admin/users',               label: '[Admin] Get all users' },
  { method: 'GET',    endpoint: '/admin/user-list',           label: '[Admin] Get all users (alt)' },
  { method: 'DELETE', endpoint: '/admin/users/{userId}',      label: '[Admin] Delete user' },
  { method: 'PUT',    endpoint: '/admin/users/{userId}',      label: '[Admin] Update user' },
  { method: 'GET',    endpoint: '/admin/logs',                label: '[Admin] Get admin logs' },
  { method: 'GET',    endpoint: '/admin/insights',            label: '[Admin] Get insights' },
  { method: 'GET',    endpoint: '/admin/stations',            label: '[Admin] Get all stations' },
  { method: 'POST',   endpoint: '/admin/stations',            label: '[Admin] Add station' },
  { method: 'PUT',    endpoint: '/admin/stations/{stationId}', label: '[Admin] Update station' },
  { method: 'DELETE', endpoint: '/admin/stations/{stationId}', label: '[Admin] Delete station' },
  { method: 'GET',    endpoint: '/feedback/',                 label: '[Admin] Get all feedback' },
  { method: 'GET',    endpoint: '/feedback/statistics',        label: '[Admin] Feedback stats' },
  { method: 'GET',    endpoint: '/charger-sessions/sessions/logs', label: '[Admin] Session logs' },
  { method: 'GET',    endpoint: '/charger-reviews/admin/all',  label: '[Admin] All reviews' },
];

// export all groups
export {
  userAuth,
  adminAuth,
  profile,
  vehicles,
  chargeStations,
  chargerSessions,
  chargerReviews,
  navigation,
  feedback,
  adminOnly,
};

// export as one array
export const allEndpoints = [
  ...userAuth,
  ...adminAuth,
  ...profile,
  ...vehicles,
  ...chargeStations,
  ...chargerSessions,
  ...chargerReviews,
  ...navigation,
  ...feedback,
  ...adminOnly,
];

//export default apiEndpoints;