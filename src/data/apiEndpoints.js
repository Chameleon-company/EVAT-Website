// src/data/apiEndpoints.js
// edit, add, remove, or group endpoints here!

/*
ADDING NEW GROUP TEMPLATE

// Name of route file on Backend
const <routeName> = [
  { method: '<method>', endpoint: '<path>', label: '<description>' },
];

Then add the <routeName> to the export list at the bottom of the file
*/

// Admin Auth Route
const adminAuth = [
  { method: 'POST',   endpoint: '/admin-auth/login',                label: 'Admin login (step 1)' },
  { method: 'POST',   endpoint: '/admin-auth/verify-2fa',           label: 'Admin 2FA verification' },
  { method: 'PUT',    endpoint: '/admin-auth/update-credentials',   label: 'Update admin credentials' },
];

// Admin Route
const admin = [
  { method: 'GET',    endpoint: '/admin/users',                   label: '[Admin] Get all users' },
  { method: 'DELETE', endpoint: '/admin/users/{userId}',          label: '[Admin] Delete user' },
  { method: 'PUT',    endpoint: '/admin/users/{userId}',          label: '[Admin] Update user' },
  { method: 'GET',    endpoint: '/admin/logs',                    label: '[Admin] Get admin logs' },
  { method: 'GET',    endpoint: '/admin/insights',                label: '[Admin] Get insights' },
  { method: 'GET',    endpoint: '/admin/stations',                label: '[Admin] Get all stations' },
  { method: 'POST',   endpoint: '/admin/stations',                label: '[Admin] Add station' },
  { method: 'PUT',    endpoint: '/admin/stations/{stationId}',    label: '[Admin] Update station' },
  { method: 'DELETE', endpoint: '/admin/stations/{stationId}',    label: '[Admin] Delete station' },
];

// Charger Reviews Route
const chargerReviews = [
  { method: 'POST',   endpoint: '/charger-reviews',                                   label: 'Submit review' },
  { method: 'PUT',    endpoint: '/charger-reviews/{reviewId}',                        label: 'Update review' },
  { method: 'DELETE', endpoint: '/charger-reviews/{reviewId}',                        label: 'Delete review' },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}',               label: 'Get reviews for charger' },
  { method: 'GET',    endpoint: '/charger-reviews/user/{userId}',                     label: 'Get review by specific user' },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}/stats',         label: 'Get rating stats' },
  { method: 'POST',   endpoint: '/charger-reviews/stats/multiple',                    label: 'Get rating stats for multiple chargers' },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}/user-stats',    label: 'Check if a user has reviewed a charger' },
  { method: 'GET',    endpoint: '/charger-reviews/admin/all',                         label: '[Admin] All reviews' },
];

// Charger Session Route
const chargerSessions = [
  { method: 'GET',    endpoint: '/charger-sessions/{sessionId}',          label: 'Get session by ID' },
  { method: 'GET',    endpoint: '/charger-sessions/user/{userId}',        label: 'Get user sessions' },
  { method: 'GET',    endpoint: '/charger-sessions/station/{stationId}',  label: 'Get station sessions' },
  { method: 'POST',   endpoint: '/charger-sessions/',                     label: 'Start new session' },
  { method: 'PATCH',  endpoint: '/charger-sessions/end/{sessionId}',      label: 'End session' },
  { method: 'GET',    endpoint: '/charger-sessions/sessions/stream',      label: 'Get session stream' },
  { method: 'GET',    endpoint: '/charger-sessions/sessions/logs',        label: '[Admin] Session logs' },
];

// Charger
const charger = [
  { method: 'POST',   endpoint: '/altchargers/nearby',            label: 'Find nearby chargers' },
];

// Feedback Route
const feedback = [
  { method: 'POST',   endpoint: '/feedback/',                     label: 'Submit feedback' },
  { method: 'GET',    endpoint: '/feedback/',                     label: '[Admin] Get all feedback' },
  { method: 'GET',    endpoint: '/feedback/statistics',           label: '[Admin] Feedback stats' },
  { method: 'GET',    endpoint: '/feedback/email',                label: '[Admin] Feedback by email' },
  { method: 'GET',    endpoint: '/feedback/{feedbackId}',         label: '[Admin] Get feedback by ID' },
  { method: 'PUT',    endpoint: '/feedback/{feedbackId}/status',  label: '[Admin] Update feedback status by ID' },
  { method: 'DELETE', endpoint: '/feedback/{feedbackId}',         label: '[Admin] Delete feedback by ID' },
];

// Navigation Route
const navigation = [
  { method: 'POST',   endpoint: '/navigation/from-points',        label: 'Route from coordinates' },
  { method: 'POST',   endpoint: '/navigation/from-sentence',      label: 'Route from address text' },
];

// Profile Route
const profile = [
  { method: 'GET',    endpoint: '/profile/user-profile',              label: 'Get full user profile' },
  { method: 'POST',   endpoint: '/profile/vehicle-model',             label: 'Update vehicle model' },
  { method: 'POST',   endpoint: '/profile/add-favourite-station',     label: 'Add favourite station' },
  { method: 'POST',   endpoint: '/profile/remove-favourite-station',  label: 'Remove favourite station' },
];

// Station Route
const station = [
  { method: 'GET',    endpoint: '/chargers',                      label: 'Get all chargers' },
  { method: 'GET',    endpoint: '/chargers/nearest-charger',      label: 'Get nearest charger' },
  { method: 'GET',    endpoint: '/chargers/{stationId}',          label: 'Get charger by station ID' },
  { method: 'GET',    endpoint: '/chargers/GoogleMapsChargers',   label: 'Get Google Maps chargers' },
];

// User Route
const user = [
  { method: 'POST',   endpoint: '/auth/register',                 label: 'Register new user' },
  { method: 'POST',   endpoint: '/auth/login',                    label: 'Login' },
  { method: 'POST',   endpoint: '/auth/refresh-token',            label: 'Refresh access token' },
  { method: 'GET',    endpoint: '/auth/profile',                  label: 'Get user profile' },
  { method: 'PUT',    endpoint: '/auth/profile',                  label: 'Update user profile' },
  { method: 'GET',    endpoint: '/auth/user-list',                label: '[Admin] Get all users' },
];

// Vehicle Route
const vehicle = [
  { method: 'GET',    endpoint: '/vehicle',                       label: 'Get all vehicles' },
  { method: 'GET',    endpoint: '/vehicle/{vehicleId}',           label: 'Get vehicle by ID' },
];

// export all groups
export {
  adminAuth,
  admin,
  chargerReviews,
  chargerSessions,
  charger,
  feedback,
  navigation,
  profile,
  station,
  user,
  vehicle,
};

// export as one array
export const allEndpoints = [
  ...adminAuth,
  ...admin,
  ...chargerReviews,
  ...chargerSessions,
  ...charger,
  ...feedback,
  ...navigation,
  ...profile,
  ...station,
  ...user,
  ...vehicle,
];

//export default apiEndpoints;