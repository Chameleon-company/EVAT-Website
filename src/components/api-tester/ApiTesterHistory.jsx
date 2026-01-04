// src/components/api-tester/ApiTesterHistory.jsx
const ApiTesterHistory = ({ history, onLoad, onClear }) => {
  if (history.length === 0) return null;

  return (
    <details>
      {/* history title with count */}
      <summary className="history-recent h6"> Recent Requests ({history.length})
        {/* clear history button */}
        <button 
          className="btn btn-danger btn-small" 
          onClick={(e) => { e.preventDefault(); onClear(); }}>
          Clear History
        </button>
      </summary>

      <div className="history-container">
        {/* create list of history items */}
        {history.map((item, idx) => (
          <div
            className={`history-details ${item.status >= 200 && item.status < 300 ? 'success' : 'error'}`} 
            key={idx}
            onClick={() => onLoad(item)}
          >
            {/* history item formating */}
            <span className="font-bold">
              {item.method}
            </span>
            <span className="font-semibold font-italic">
              {item.endpoint}
            </span>
            <span className="history-time-font">
              — {item.timestamp}
            </span>
            <span className="history-time-font font-semibold font-italic">
              ({item.status})
            </span>
          </div>
        ))}
      </div>
    </details>
  );
};

export default ApiTesterHistory;