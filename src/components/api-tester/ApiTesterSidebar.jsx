// src/components/api-tester/ApiTesterSidebar.jsx
import { useState } from 'react';
import {
  adminAuth,
  admin,
  booking,
  chargerReviews,
  chargerSessions,
  charger,
  feedback,
  navigation,
  profile,
  station,
  supportRequest,
  user,
  vehicle,
} from '../../data/apiEndpoints';

// on clicking an endpoint item
const EndpointItem = ({ item, onEndpointClick }) => (
  <div
    onClick={() => onEndpointClick(item)}
    className={`endpoint-item endpoint-item-${item.method.toLowerCase()}`}
  >
    <div className="endpoint-top-row text-tiny ">
      {/* method */}
      <span className={`method-badge uppercase font-bold method-${item.method.toLowerCase()}`}>
        {item.method}
      </span>
      {/* description */}
      <span className="endpoint-description">{item.label}</span>
    </div>
    {/* path */}
    <code className="endpoint-path font-bold text-small">{item.endpoint}</code>
  </div>
);

const ApiTesterSidebar = ({ onEndpointClick }) => {
  // reset search state
  const [search, setSearch] = useState('');

  // all groups with titles
  const groups = [
    { title: 'Admin Auth Route', endpoints: adminAuth, isAdmin: true },
    { title: 'Admin Route', endpoints: admin, isAdmin: true },
    { title: 'Booking Route', endpoints: booking },
    { title: 'Charger Reviews Route', endpoints: chargerReviews },
    { title: 'Charger Session Route', endpoints: chargerSessions },
    { title: 'Charger', endpoints: charger },
    { title: 'Feedback Route', endpoints: feedback },
    { title: 'Navigation Route', endpoints: navigation },
    { title: 'Profile Route', endpoints: profile },
    { title: 'Station Route', endpoints: station },
    { title: 'Support Request Route', endpoints: supportRequest },
    { title: 'User Route', endpoints: user },
    { title: 'Vehicle Route', endpoints: vehicle },
  ];

  // filter function — searches endpoint, label, method
  const filteredGroups = groups
    .map(group => ({
      ...group,
      endpoints: group.endpoints.filter(item =>
        search === '' ||
        item.endpoint.toLowerCase().includes(search.toLowerCase()) ||
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.method.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(group => group.endpoints.length > 0);

  return (
    <div>
      <h6>Quick Endpoints</h6>

      {/* search bar */}
      <div>
        <input
          className="input form-full-width"
          type="text"
          placeholder="Search endpoints... (e.g. login, admin, POST)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        {search && (
          // search results
          <div>
            {filteredGroups.reduce((acc, g) => acc + g.endpoints.length, 0)} results
          </div>
        )}
      </div>

      <div className="endpoint-sidebar">
        {filteredGroups.length === 0 ? (
          // if no endpoints in filtered group
          <div className="text-center font-bold">
            No endpoints match "{search}"
          </div>
        ) : (
          // some endpoints found
          filteredGroups.map((group, i) => (
            <details key={i} open>
              {/* endpoint group titles */}
              <summary className={`h6 endpoint-group-title ${group.isAdmin ? 'admin-only' : ''}`}>
                {group.title}
                {search && <span>({group.endpoints.length})</span>}
              </summary>
              {/* show endpoints */}
              {group.endpoints.map((item, idx) => (
                <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
              ))}
            </details>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiTesterSidebar;