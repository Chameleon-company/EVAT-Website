// src/components/api-tester/ApiTesterSidebar.jsx
import {
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
        {renderGroup(adminAuth, 'Admin Auth Route', true)}
        {renderGroup(admin, 'Admin Route', true)}
        {renderGroup(chargerReviews, 'Charger Reviews Route')}
        {renderGroup(chargerSessions, 'Charger Session Route')}
        {renderGroup(charger, 'Charger')}
        {renderGroup(feedback, 'Feedback Route')}
        {renderGroup(navigation, 'Navigation Route')}
        {renderGroup(profile, 'Profile Route')}
        {renderGroup(station, 'Station Route')}
        {renderGroup(user, 'User Route')}
        {renderGroup(vehicle, 'Vehicle Route')}
      </div>
    </div>
  );
};

export default ApiTesterSidebar;