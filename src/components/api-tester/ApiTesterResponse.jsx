// src/components/api-tester/ApiTesterResponse.jsx
import { JsonView } from 'react-json-view-lite';

const ApiTesterResponse = ({ response, error }) => {
  if (error) return <div className="validation-error">Error: {error}</div>;
  if (!response) return null;

  // check if response was successful
  const isSuccess = response.status >= 200 && response.status < 300;

  return (
    <div className="container auto-width force-height">
      {/* response status */}
      <h4 className={`response-status ${isSuccess ? 'success' : 'error'}`}>
        Response: {response.status} {response.statusText}
      </h4>

      {/* response header */}
      <details>
        <summary className="h6">Headers</summary>
        <pre className="response-preview text-small font-bold">{JSON.stringify(response.headers, null, 2)}</pre>
      </details>

      {/* response body */}
      <div>
        <h6>Body:</h6>
        <div className="response-preview text-small font-bold" >
          <JsonView
            data={response.parsedBody || response.body}
            shouldExpandNodeExpand={(level) => level < 2}
          />
        </div>
      </div>
    </div>
  );
};

export default ApiTesterResponse;