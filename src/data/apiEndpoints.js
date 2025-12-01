// src/data/apiEndpoints.js
// edit, add, remove, or group endpoints here!

/*
ADDING NEW GROUP TEMPLATE

// Name of route file on Backend
const <routeName> = [
  { method: '<method>', endpoint: '<path>', label: '<description>', body: templates.<templateName> },
];

ADDING A TEMPLATE

  // Name of template
  <templateName>: 
`{
  "<key>": "<value>",
  "<key>": "<value>"
}`,

The template must use a backtick (literals) to support multiple lines, 
otherwise use a single line string

Then add the <routeName> to the export list at the bottom of the file
*/

// model templates
const templates = {
  // admin login
  adminLogin: 
`{
  "username": "string",
  "password": "string"
}`,

  // admin verify
  adminVerfiy: 
`{
  "username": "string",
  "code": "string"
}`,

  // admin update user
  adminUpdateUser: 
`{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "mobile": "string",
  "role": "user | admin"
}`,

  // add station
  stationAdd: 
`{
  "operator": "string",
  "connection_type": "string",
  "current_type": "string",
  "location": {
    "type": "Point",
    "coordinates": [
      147.327774,
      -38.005127
    ]
  }
}`,

  // update station
  stationUpdate: 
`{
  "operator": "string",
  "connection_type": "string",
  "current_type": "string",
  "location": {
    "type": "Point",
    "coordinates": [
      147.327774,
      -38.005127
    ]
  }
}`,

  // add review
  reviewAdd: 
`{
  "chargerId": "string",
  "rating": 0,
  "comment": "string"
}`,

  // update review
  reviewUpdate: 
`{
  "rating": 0,
  "comment": "string"
}`,

  // multiple reviews
  reviewMultiple: 
`{
  "chargerIds": [
    "string",
    "string",
    "string"
  ]
}`,

  // start a new session
  sessionStart:
`{
  "userId": "string",
  "stationId": "string",
  "startTime": "2025-09-07T04:00:00Z"
}`,

  // nearby location
  locationNearby: 
`{
  "latitude": -31.95,
  "longitude": 115.86,
  "radius": 25
}`,

  // add feedback
  feedbackAdd: 
`{
  "name": "string",
  "email": "email@email.com",
  "suggestion": "string"
}`,

  // update feedback
  feedbackUpdate: 
`{
  "status": "pending | reviewed | resolved"
}`,

  // navigation from points
  navigationFromPoints: 
`{
  "start": {
    "lat": -37.8477516,
    "lng": 145.1139689
  },
  "destination": {
    "lat": -37.8104952,
    "lng": 144.9627499
  }
}`,

  // navigation from sentence
  navigationFromSentence: 
`{
  "sentence": "string"
}`,

  // add vehicle to profile
  profileAddVehicle: 
`{
  "vehicleId": "string"
}`,

  // add favourite station to profile
  profileAddFavouriteStation: 
`{
  "stationId": "string"
}`,

  // remove favourite station to profile
  profileRemoveFavouriteStation: 
`{
  "stationId": "string"
}`,

  // register a new user
  userRegister: 
`{
  "firstName": "string",
  "lastName": "string",
  "email": "email@email.com",
  "password": "string",
  "mobile": "string"
}`,

  // user login with email and password
  userLogin: 
`{
  "email": "email@email.com",
  "password": "string"
}`,

  // refresh token
  refreshToken: 
`{
  "refreshToken": "string"
}`,

  // update user
  userUpdate: 
`{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "mobile": "string"
}`,

};

// Admin Auth Route
const adminAuth = [
  { method: 'POST',   endpoint: '/admin-auth/login',              label: 'Admin login (step 1)',                  body: templates.adminLogin },   // NOT WORKING - 500 internal server error
  { method: 'POST',   endpoint: '/admin-auth/verify-2fa',         label: 'Admin 2FA verification',                body: templates.adminVerfiy },  // tested and working
  { method: 'PUT',    endpoint: '/admin-auth/update-credentials', label: 'Update admin credentials',              body: templates.adminLogin },   // NOT WORKING - 403 forbidden
];

// Admin Route // NOT WORKING - 403 forbidden
const admin = [
  { method: 'GET',    endpoint: '/admin/users',                   label: '[Admin] Get all users' },
  { method: 'DELETE', endpoint: '/admin/users/{userId}',          label: '[Admin] Delete user' },
  { method: 'PUT',    endpoint: '/admin/users/{userId}',          label: '[Admin] Update user',                   body: templates.adminUpdateUser },
  { method: 'GET',    endpoint: '/admin/logs',                    label: '[Admin] Get admin logs' },
  { method: 'GET',    endpoint: '/admin/insights',                label: '[Admin] Get insights' },
  { method: 'GET',    endpoint: '/admin/stations',                label: '[Admin] Get all stations' },
  { method: 'POST',   endpoint: '/admin/stations',                label: '[Admin] Add station',                   body: templates.stationAdd },
  { method: 'PUT',    endpoint: '/admin/stations/{stationId}',    label: '[Admin] Update station',                body: templates.stationUpdate },
  { method: 'DELETE', endpoint: '/admin/stations/{stationId}',    label: '[Admin] Delete station' },
];

// Charger Reviews Route // NOT WORKING
const chargerReviews = [
  { method: 'POST',   endpoint: '/charger-reviews',                                   label: 'Submit review',                           body: templates.reviewAdd },
  { method: 'PUT',    endpoint: '/charger-reviews/{reviewId}',                        label: 'Update review',                           body: templates.reviewUpdate },
  { method: 'DELETE', endpoint: '/charger-reviews/{reviewId}',                        label: 'Delete review' },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}',               label: 'Get reviews for charger' },
  { method: 'GET',    endpoint: '/charger-reviews/user/{userId}',                     label: 'Get review by specific user' },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}/stats',         label: 'Get rating stats' },
  { method: 'POST',   endpoint: '/charger-reviews/stats/multiple',                    label: 'Get rating stats for multiple chargers',  body: templates.reviewMultiple },
  { method: 'GET',    endpoint: '/charger-reviews/charger/{chargerId}/user-stats',    label: 'Check if a user has reviewed a charger' },
  { method: 'GET',    endpoint: '/charger-reviews/admin/all',                         label: '[Admin] All reviews' },
];

// Charger Session Route
const chargerSessions = [
  { method: 'GET',    endpoint: '/charger-sessions/{sessionId}',          label: 'Get session by ID' },                                             // tested and working
  { method: 'GET',    endpoint: '/charger-sessions/user/{userId}',        label: 'Get user sessions' },                                             // tested and working
  { method: 'GET',    endpoint: '/charger-sessions/station/{stationId}',  label: 'Get station sessions' },                                          // tested and working
  { method: 'POST',   endpoint: '/charger-sessions/',                     label: 'Start new session',             body: templates.sessionStart },   // tested and working
  { method: 'PATCH',  endpoint: '/charger-sessions/end/{sessionId}',      label: 'End session' },                                                   // tested and working
  //{ method: 'GET',    endpoint: '/charger-sessions/sessions/stream',      label: 'Get session stream' },                                             // NOT WORKING - never gets response
  { method: 'GET',    endpoint: '/charger-sessions/sessions/logs',        label: '[Admin] Session logs' },                                          // tested and working
];

// Charger
const charger = [
  { method: 'POST',   endpoint: '/altchargers/nearby',            label: 'Find nearby chargers',                  body: templates.locationNearby },   // tested and working
];

// Feedback Route // NOT WORKING
const feedback = [
  { method: 'POST',   endpoint: '/feedback/',                     label: 'Submit feedback',                       body: templates.feedbackAdd },
  { method: 'GET',    endpoint: '/feedback/',                     label: '[Admin] Get all feedback' },
  { method: 'GET',    endpoint: '/feedback/statistics',           label: '[Admin] Feedback stats' },
  { method: 'GET',    endpoint: '/feedback/email',                label: '[Admin] Feedback by email' },
  { method: 'GET',    endpoint: '/feedback/{feedbackId}',         label: '[Admin] Get feedback by ID' },
  { method: 'PUT',    endpoint: '/feedback/{feedbackId}/status',  label: '[Admin] Update feedback status by ID',  body: templates.feedbackUpdate },
  { method: 'DELETE', endpoint: '/feedback/{feedbackId}',         label: '[Admin] Delete feedback by ID' },
];

// Navigation Route
const navigation = [
  { method: 'POST',   endpoint: '/navigation/from-points',        label: 'Route from coordinates',                body: templates.navigationFromPoints },     // tested and working
  { method: 'POST',   endpoint: '/navigation/from-sentence',      label: 'Route from address text',               body: templates.navigationFromSentence },   // NOT WORKING - no idea
];

// Profile Route
const profile = [
  { method: 'GET',    endpoint: '/profile/user-profile',              label: 'Get full user profile' },                                                             // tested and working
  { method: 'POST',   endpoint: '/profile/vehicle-model',             label: 'Update vehicle model',              body: templates.profileAddVehicle },              // tested and working
  { method: 'POST',   endpoint: '/profile/add-favourite-station',     label: 'Add favourite station',             body: templates.profileAddFavouriteStation },     // tested and working
  { method: 'POST',   endpoint: '/profile/remove-favourite-station',  label: 'Remove favourite station',          body: templates.profileRemoveFavouriteStation },  // tested and working
];

// Station Route
const station = [
  { method: 'GET',    endpoint: '/chargers',                                                  label: 'Get all chargers' },            // tested and working
  { method: 'GET',    endpoint: '/chargers/nearest-charger?lat={latValue}&lon={lonValue}',    label: 'Get nearest charger' },         // tested and working
  // nearest-charger can also have  &connector={connectorTypes}     allows for multiple comma-separated string
  //                                &current={ AC | AC3 | DC }      allows for multiple comma-separated string
  //                                &operator={operatorName}        allows for multiple comma-separated string
  { method: 'GET',    endpoint: '/chargers/{stationId}',                                      label: 'Get charger by station ID' },   // tested and working
  { method: 'GET',    endpoint: '/chargers/GoogleMapsChargers',                               label: 'Get Google Maps chargers' },    // NOT WORKING - no idea
];

// User Route
const user = [
  { method: 'POST',   endpoint: '/auth/register',                 label: 'Register new user',                     body: templates.userRegister },   // tested and working
  { method: 'POST',   endpoint: '/auth/login',                    label: 'Login',                                 body: templates.userLogin },      // tested and working
  { method: 'POST',   endpoint: '/auth/refresh-token',            label: 'Refresh access token',                  body: templates.refreshToken },   // NOT WORKING - no idea
  { method: 'GET',    endpoint: '/auth/profile',                  label: 'Get user profile' },                                                      // tested and working
  { method: 'PUT',    endpoint: '/auth/profile',                  label: 'Update user profile',                   body: templates.userUpdate },     // tested and working
  { method: 'GET',    endpoint: '/auth/user-list',                label: '[Admin] Get all users' },                                                 // tested and working
];

// Vehicle Route
const vehicle = [
  { method: 'GET',    endpoint: '/vehicle',                       label: 'Get all vehicles' },            // tested and working
  { method: 'GET',    endpoint: '/vehicle/{vehicleId}',           label: 'Get vehicle by ID' },           // tested and working
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