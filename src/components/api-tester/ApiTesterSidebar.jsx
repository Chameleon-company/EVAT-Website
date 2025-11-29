// src/components/api-tester/ApiTesterSidebar.jsx
import apiEndpoints from '../../data/apiEndpoints';

const EndpointItem = ({ item, onEndpointClick }) => (
  <div
    onClick={() => onEndpointClick(item)}
    className="api-tester-endpoint-item"
  >
    <span className={`method-badge method-${item.method.toLowerCase()}`}>
      {item.method}
    </span>
    <code>{item.endpoint}</code>
    <span className="endpoint-label">{item.label}</span>
  </div>
);

const ApiTesterSidebar = ({ onEndpointClick }) => {

  return (
    <div className="api-tester-sidebar">
      <h1>Quick Endpoints</h1>
      <div className="api-tester-endpoint-list">

        <details open>
          <summary className="endpoint-group-title">User & Auth</summary>
          {apiEndpoints.slice(0, 5).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Admin Auth (2FA)</summary>
          {apiEndpoints.slice(5, 8).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Profile & Vehicle</summary>
          {apiEndpoints.slice(8, 12).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Chargers & Stations</summary>
          {apiEndpoints.slice(12, 18).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Charging Sessions</summary>
          {apiEndpoints.slice(18, 24).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Reviews & Feedback</summary>
          {apiEndpoints.slice(24, 29).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title">Navigation</summary>
          {apiEndpoints.slice(29, 31).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

        <details open>
          <summary className="endpoint-group-title admin-only">Admin Only</summary>
          {apiEndpoints.slice(31).map((item, idx) => (
            <EndpointItem key={idx} item={item} onEndpointClick={onEndpointClick} />
          ))}
        </details>

      </div>
    </div>
  );
};

export default ApiTesterSidebar;