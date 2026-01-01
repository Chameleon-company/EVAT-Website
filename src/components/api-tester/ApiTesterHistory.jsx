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
            <strong>{item.method}</strong> {item.endpoint}
            <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '8px' }}>
              — {item.timestamp} ({item.status})
            </span>
          </div>
        ))}
      </div>
    </details>
  );
};

export default ApiTesterHistory;