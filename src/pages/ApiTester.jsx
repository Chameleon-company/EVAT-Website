import NavBar from "../components/NavBar";
import Background from "../components/Background";
import ChatBubble from "../components/ChatBubble";
import "../styles/ApiTester.css";

import { useState } from 'react';

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('/vehicle');     // path + endpoint
  const [method, setMethod] = useState('GET');              // HTTP method
  const [body, setBody] = useState('');                     // base string for bodies
  const [response, setResponse] = useState(null);           // response object
  const [error, setError] = useState('');                   // error message
  const [loading, setLoading] = useState(false);            // in flight state
  const baseUrl = import.meta.env.VITE_API_URL;             // base url

  // handles HTTP request
  const sendRequest = async () => {
    // reset results
    setError('');
    setResponse(null);
    setLoading(true);
    
    try {
      // build URLs - relative and/or absolute
      const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

      // prepare JSON body if needed
      let jsonBody = undefined;
      if (method !== 'GET' && method !== 'DELETE' && body.trim()) {
        jsonBody = JSON.parse(body);
      }

      // fetch request
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          // add authorization
        },
        body: jsonBody ? JSON.stringify(jsonBody) : undefined,
      });

      // get the content of the response
      const contentType = res.headers.get('content-type');
      // try to parse response as JSON, else plain text
      const data = contentType?.includes('application/json') ? await res.json() : await res.text();

      // successful parse, store response to display
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
      });
    } catch (err) {
      // catch error
      setError(err.message || 'Request failed');
    } finally {
      // stop the loading spinner
      setLoading(false);
    }
  };

  // colour the status codes - 2xx is green, rest are red
  const isSuccess = response && response.status >= 200 && response.status < 300;
  
  // to display
  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>

      <div className="api-tester-content">
        <div className="api-tester-container">
          <h1>Internal API Tester</h1>

          {/* API path entry */}
          <div className="api-tester-form-group">
            <label>Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="api-tester-input"
              placeholder="e.g., /api/vehicle"
            />
          </div>

          {/* HTTP method selector (dropdown box) */}
          <div className="api-tester-form-group">
            <label>Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="api-tester-select">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
            </select>
          </div>

          {/* JSON text area - currently only for POST and PUT */}
          {/* Hidden for GET and DELETE */}
          {method !== 'GET' && method !== 'DELETE' && (
            <div className="api-tester-form-group">
              <label>JSON Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="api-tester-textarea"
                placeholder='{ "placeholder key": "placeholder value" }'
              />
            </div>
          )}

          {/* send request button */}
          <button onClick={sendRequest} disabled={loading} className="api-tester-button">
            {loading ? 'Sending...' : 'Send Request'}
          </button>

          {/* error message if unsuccessful request */}
          {error && <div className="api-tester-error">Error: {error}</div>}

          {/* show response if successful request */}
          {response && (
            <div className="api-tester-response">
              {/* response status */}
              <div className={`api-tester-status ${isSuccess ? 'success' : 'error'}`}>
                Response: {response.status} {response.statusText}
              </div>

              {/* collapsoble response header */}
              <details className="api-tester-details">
                <summary>Headers</summary>
                <pre className="api-tester-pre">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </details>

              {/* response body */}
              <div>
                <strong>Body:</strong>
                <pre className="api-tester-pre">{response.body}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
      </Background>
      <ChatBubble />
    </div>
  );
};

export default ApiTester;