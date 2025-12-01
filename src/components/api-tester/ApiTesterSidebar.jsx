// src/components/api-tester/ApiTesterSidebar.jsx
import { useState } from 'react';
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
  // reset search state
  const [search, setSearch] = useState('');

  // all groups with titles
  const groups = [
    { title: 'Admin Auth Route', endpoints: adminAuth, isAdmin: true },
    { title: 'Admin Route', endpoints: admin, isAdmin: true },
    { title: 'Charger Reviews Route', endpoints: chargerReviews },
    { title: 'Charger Session Route', endpoints: chargerSessions },
    { title: 'Charger', endpoints: charger },
    { title: 'Feedback Route', endpoints: feedback },
    { title: 'Navigation Route', endpoints: navigation },
    { title: 'Profile Route', endpoints: profile },
    { title: 'Station Route', endpoints: station },
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
    <div className="api-tester-sidebar">
      <h2>Quick Endpoints</h2>

      {/* search bar */}
      <div className="api-sidebar-search-wrapper">
        <input
          type="text"
          placeholder="Search endpoints... (e.g. login, admin, POST)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="api-sidebar-search-input"
          autoFocus
        />
        {search && (
          // search results
          <div className="api-sidebar-search-results">
            {filteredGroups.reduce((acc, g) => acc + g.endpoints.length, 0)} results
          </div>
        )}
      </div>

      <div className="api-tester-endpoint-list">
        {filteredGroups.length === 0 ? (
          // if no endpoints in filtered group
          <div className="api-sidebar-no-results">
            No endpoints match "{search}"
          </div>
        ) : (
          // some endpoints found
          filteredGroups.map((group, i) => (
            <details key={i} open>
              {/* endpoint group titles */}
              <summary className={`endpoint-group-title ${group.isAdmin ? 'admin-only' : ''}`}>
                {group.title}
                {search && <span className="search-count"> ({group.endpoints.length})</span>}
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


  {/* render the group options */}
  // const renderGroup = (endpoints, title, isAdmin = false) => (
  //   <details open>
  //     <summary className={`endpoint-group-title ${isAdmin ? 'admin-only' : ''}`}>
  //       {title}
  //     </summary>
  //     {endpoints.map((item, idx) => (
  //       <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
  //     ))}
  //   </details>
  // );

  // return (
  //   <div className="api-tester-sidebar">
  //     <h1>Quick Endpoints</h1>
  //     <div className="api-tester-endpoint-list">
        {/* list of endpoints */}
        {/* {renderGroup(adminAuth, 'Admin Auth Route', true)}
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
  ); */}


};

export default ApiTesterSidebar;