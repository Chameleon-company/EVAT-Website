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
    <div>
      <div>
        {/* HTTP method selector (dropdown box) */}
        <div>
          <label className='form-label'>Method</label>
          <select 
            className="full-width font-bold"
            value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        {/* API path entry */}
        <div>
          <label className='form-label'>Endpoint</label>
          <input
            className="input form-full-width font-bold"
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g. /vehicle"
          />
        </div>
      </div>

      {/* authorization token field */}
      <div>
        <div>
          <label className='form-label'>
            Authorization Bearer Token{' '}
            <span> (required for protected routes)</span>
          </label>
          {/* token input field */}
          <div>
            <input
              className="input form-full-width"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste JWT or click button"
              autoComplete="off"
            />
          </div>

          {/* show / hide token button */}
          <div>
            <button
              className="btn btn-primary two-hundred-width btn-small"
              type="button"
              onClick={() => setShowToken(!showToken)}
            >{showToken ? 'Hide' : 'Show'} Token
            </button>

            {/* auto fill token button */}
            <button
              className="btn btn-primary two-hundred-width btn-small"
              type="button"
              onClick={autoFillToken}
            >Auto-Fill Current Token
            </button>
          </div>
        </div>
      </div>

      {/* JSON text area - currently only for POST and PUT */}
      {/* hidden for GET and DELETE */}
      {method !== 'GET' && method !== 'DELETE' && (
        <div>
          <label className='form-label'>JSON Body</label>
          <textarea
            className="input font-bold half-width fit-height"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='Enter JSON body or click a Quick Endpoint'
          />
        </div>
      )}
      {/* send request button */}
      <button
        className="btn btn-primary btn-full"
        onClick={onSend} disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </div>
  );
};

export default ApiTesterForm;