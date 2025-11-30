// src/components/api-tester/ApiTesterForm.jsx
const ApiTesterForm = ({
  method,       setMethod,
  endpoint,     setEndpoint,
  body,         setBody,
  token,        setToken,
  showToken,    setShowToken,
  loading,
  onSend,
}) => {
  const autoFillToken = () => {
    try {
      // get user data from local storage
      const userData = localStorage.getItem('currentUser');
      // handle no data found
      if (!userData) {
        alert('No login session found. Please log in first.');
        return;
      }
      // parse JSON
      const parsed = JSON.parse(userData);
      if (parsed.token) {
        // token found
        setToken(parsed.token);
        alert('Current login token loaded!');
      } else {
        // no token found
        alert('No token found in session.');
      }
    } catch (e) {
      alert('Failed to read token from localStorage.');
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', marginBottom: '10px' }}>
        {/* HTTP method selector (dropdown box) */}
        <div className="api-tester-form-group">
          <label>Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="api-tester-select">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        {/* API path entry */}
        <div className="api-tester-form-group">
          <label>Endpoint</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="api-tester-input"
            placeholder="e.g. /vehicle"
          />
        </div>
      </div>

      {/* authorization token field */}
      <div style={{  marginBottom: '10px' }}>
        <div className="api-tester-form-group">
          <label>
            Authorization Bearer Token{' '}
            <span style={{ fontWeight: 'normal', color: '#666' }}> (required for protected routes)</span>
          </label>
          {/* token input field */}
          <div style={{ position: 'relative' , marginBottom: '12px'}}>
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="api-tester-input"
              placeholder="Paste JWT or click button"
              autoComplete="off"
            />
          </div>

          {/* show / hide token button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="api-tester-button"
              style={{ width: '200px' }}
            >
              {showToken ? 'Hide' : 'Show'} Token
            </button>

            {/* auto fill token button */}
            <button
              type="button"
              onClick={autoFillToken}
              className="api-tester-button"
              style={{width: '250px', padding: '10px', fontSize: '1rem'}}
            >
              Auto-Fill Current Token
            </button>
          </div>
        </div>
      </div>

      {/* JSON text area - currently only for POST and PUT */}
      {/* hidden for GET and DELETE */}
      {method !== 'GET' && method !== 'DELETE' && (
        <div className="api-tester-form-group" style={{ marginBottom: '20px' }}>
          <label>JSON Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="api-tester-textarea"
            placeholder='{ "make": "Tesla", "model": "Model 3" }'
          />
        </div>
      )}

      {/* send request button */}
      <button
        onClick={onSend} disabled={loading} className="api-tester-button"
        style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </>
  );
};

export default ApiTesterForm;