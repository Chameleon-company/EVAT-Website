// src/components/api-tester/ApiTesterResponse.jsx
import { JsonView } from 'react-json-view-lite';

const ApiTesterResponse = ({ response, error }) => {
  if (error) return <div className="api-tester-error">Error: {error}</div>;
  if (!response) return null;

  const isSuccess = response.status >= 200 && response.status < 300;

  return (
    <div className="api-tester-response">
      <div className={`api-tester-status ${isSuccess ? 'success' : 'error'}`}>
        Response: {response.status} {response.statusText}
      </div>

      <details className="api-tester-details">
        <summary>Headers</summary>
        <pre className="api-tester-pre">{JSON.stringify(response.headers, null, 2)}</pre>
      </details>

      <div>
        <strong>Body:</strong>
        <div className="api-tester-pre" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <JsonView
            data={response.parsedBody || response.body}
            shouldExpandNodeExpand={(level) => level < 2}
            style={{
              fontSize: '0.95rem',
              fontFamily: '"Fira Code", "Courier New", monospace',
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApiTesterResponse;