// src/pages/ApiTester.jsx
import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ApiTesterHistory from "../components/api-tester/ApiTesterHistory";
import ApiTesterSidebar from "../components/api-tester/ApiTesterSidebar";
import ApiTesterResponse from "../components/api-tester/ApiTesterResponse";
import ApiTesterForm from "../components/api-tester/ApiTesterForm";

import '../styles/API.css';
import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

const ApiTester = () => {
  // set the state
  const [endpoint, setEndpoint] = useState('/vehicle');     // path + endpoint
  const [method, setMethod] = useState('GET');              // HTTP method
  const [body, setBody] = useState('');                     // base string for bodies
  const [token, setToken] = useState('');                   // JWT
  const [showToken, setShowToken] = useState(false);        // toggle token visibility
  const [response, setResponse] = useState(null);           // response object
  const [error, setError] = useState('');                   // error message
  const [loading, setLoading] = useState(false);            // in flight state
  const [history, setHistory] = useState([]);               // array of past requests
  const [endpointSearch, setEndpointSearch] = useState(''); // searching the quick endpoint list
  const baseUrl = import.meta.env.VITE_API_URL;             // base url

  // automatically load token when loading the page
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || {});
      if (user.token) setToken(user.token);
    } catch (e) {
      // warn of error
      console.warn('Failed to auto-load token from currentUser');
    }
  }, []);

  // handles HTTP send request
  const sendRequest = async () => {
    // reset results
    setError('');
    setResponse(null);
    setLoading(true);
    
    try {
      // build URLs - relative and/or absolute
      // Vite was causing Result 200 for non-existant paths
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${baseUrl.replace(/\/+$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

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
          ...(token.trim() && { Authorization: `Bearer ${token.trim()}` }),
        },
        body: jsonBody ? JSON.stringify(jsonBody) : undefined,
      });

      // get the content of the response
      const contentType = res.headers.get('content-type') || '';
      let data;
      // try to parse response as JSON, else plain text
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();

        // detect Vite fallback -> warn the developer
        if (res.status === 200 && typeof data === 'string' && data.includes('<title>Stand-in EVAT Website')) {
          setError('Request did NOT reach the backend — Vite served the frontend with index.html.');
          setResponse(null);
          setLoading(false);
          return;     // this return stops an invalid path to appear in the history
        }
      }

      // successful parse, store response to display
      const responseObj = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
        parsedBody: typeof data === 'object' ? data : null,
      };
      // set response
      setResponse(responseObj);

      // add to history (only on success)
      const historyEntry = {
        timestamp: new Date().toLocaleTimeString(),
        method,
        endpoint,
        body: body.trim() || null,
        status: res.status,
      };
      // keep last 15 requests
      setHistory(prev => [historyEntry, ...prev].slice(0, 15)); 

    } catch (err) {
      // catch error
      setError(err.message || 'Request failed');
    } finally {
      // stop the loading spinner
      setLoading(false);
    }
  };

  // load a request from history
  const loadFromHistory = (item) => {
    setEndpoint(item.endpoint);
    setMethod(item.method);
    setBody(item.body || '');
    window.scrollTo(0, 0);
  };

  // clear all history
  const clearHistory = () => setHistory([]);

  // quick endpoint selected
  const handleEndpointClick = (item) => {
    setMethod(item.method);
    setEndpoint(item.endpoint.replace(/\{[^}]+\}/g, '123')); // adds 123 if path expects input
    // clear body for GET/DELETE or no example
    setBody('');
    // auto-fill body if it exists and is POST/PUT/PATCH
    if (item.body && ['POST', 'PUT', 'PATCH'].includes(item.method)) {
      setBody(item.body.trim());
    }
  };

  // hide page in production unless ?devtools=1 is in URL
  const isDev = import.meta.env.DEV;
  const forceShow = new URLSearchParams(window.location.search).get('devtools') === '1';

  // if not in development mode and not forceing to show with ?devtools=1
  if (!isDev && !forceShow) {
    return (
      <div>
        <NavBar />
        {/* background */}
        <div className="background-image" />
        <h4 className='h4 text-center auto-width'>Nothing to see here!</h4>
      </div>
    );
  }

  // return tester UI
  return (
    <div>
      <NavBar />
      <h3 className='h3 text-center auto-width'>Internal API Tester</h3>
      <div className="container-split auto-width">
        <div className="grid-content">
          {/* left panel */}
          <div >
            {/* request history */}
            <ApiTesterHistory history={history} onLoad={loadFromHistory} onClear={clearHistory} />

            {/* api form */}
            <ApiTesterForm
              method={method}
              setMethod={setMethod}
              endpoint={endpoint}
              setEndpoint={setEndpoint}
              body={body}
              setBody={setBody}
              token={token}
              setToken={setToken}
              showToken={showToken}
              setShowToken={setShowToken}
              loading={loading}
              onSend={sendRequest}
            />

            {/* response */}
            <ApiTesterResponse response={response} error={error} />
          </div>

          {/* right panel */}
          {/* quick endpoints */}
          <ApiTesterSidebar onEndpointClick={handleEndpointClick} />
        </div>
      </div>
    </div>
  );
};

export default ApiTester;


