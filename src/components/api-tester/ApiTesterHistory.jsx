// src/components/api-tester/ApiTesterHistory.jsx
const ApiTesterHistory = ({ history, onLoad, onClear }) => {
  if (history.length === 0) return null;

  return (
    <details style={{ marginBottom: '30px' }}>
      <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* history title with count */}
        Recent Requests ({history.length})
        {/* clear history button */}
        <button className="api-tester-button-clear api-tester-clear-btn" onClick={(e) => { e.preventDefault(); onClear(); }}>
          Clear History
        </button>
      </summary>

      <div style={{ marginBottom: '12px', maxHeight: '300px', overflowY: 'auto' }}>
        {/* create list of history items */}
        {history.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onLoad(item)}
            style={{
              padding: '10px',
              backgroundColor: item.status >= 200 && item.status < 300 ? '#f0fff4' : '#fff5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginBottom: '2px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
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