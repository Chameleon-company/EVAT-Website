// src/components/api-tester/ApiTesterSidebar.jsx
import {
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
} from '../../data/apiEndpoints';

// on clicking an endpoint item
const EndpointItem = ({ item, onEndpointClick }) => (
  <div
    onClick={() => onEndpointClick(item)}
    className="api-tester-endpoint-item"
  >
    {/* fill method */}
    <span className={`method-badge method-${item.method.toLowerCase()}`}>
      {item.method}
    </span>
    {/* fill endpoint path */}
    <code>{item.endpoint}</code>
    <span className="endpoint-label">{item.label}</span>
  </div>
);

const ApiTesterSidebar = ({ onEndpointClick }) => {
  {/* render the group options */}
  const renderGroup = (endpoints, title, isAdmin = false) => (
    <details open>
      <summary className={`endpoint-group-title ${isAdmin ? 'admin-only' : ''}`}>
        {title}
      </summary>
      {endpoints.map((item, idx) => (
        <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
      ))}
    </details>
  );

  return (
    <div className="api-tester-sidebar">
      <h1>Quick Endpoints</h1>
      <div className="api-tester-endpoint-list">
        {/* list of endpoints */}
        {renderGroup(userAuth, 'User & Auth')}
        {renderGroup(adminAuth, 'Admin Auth (2FA)')}
        {renderGroup(profile, 'Profile')}
        {renderGroup(vehicles, 'Vehicles')}
        {renderGroup(chargeStations, 'Charger Stations')}
        {renderGroup(chargerSessions, 'Charging Sessions')}
        {renderGroup(chargerReviews, 'Reviews')}
        {renderGroup(navigation, 'Navigation')}
        {renderGroup(feedback, 'Feedback')}
        {renderGroup(adminOnly, 'Admin Only', true)}
      </div>
    </div>
  );
};

export default ApiTesterSidebar;