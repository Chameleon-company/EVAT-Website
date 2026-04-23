import { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Loader2 } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/VoiceQuery.css';

function VoiceQuery({ onQueryResult }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    setIsRecording(listening);
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-query-container">
        <div className="error-banner">
          Sorry, your browser does not support speech recognition.
          Please use Chrome, Edge, or Safari.
        </div>
      </div>
    );
  }

  const handleMicrophoneClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
      return;
    }

    setError('');
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US'
    });

    setIsRecording(true);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter or speak your query');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }

    setLoading(true);
    setError('');
    setResult(null);

    setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();

      let fakeData = {
        answer_text: 'A nearby charging station has been highlighted on the map.',
        intent: 'general_query',
        entities: {
          congestion: 'unknown'
        }
      };

      if (normalizedQuery.includes('cheap')) {
        fakeData = {
          answer_text: 'The most cost-effective available charging station has been selected.',
          intent: 'find_low_cost_station',
          entities: {
            congestion: 'low'
          }
        };
      } else if (
        normalizedQuery.includes('nearest') ||
        normalizedQuery.includes('nearby') ||
        normalizedQuery.includes('closest')
      ) {
        fakeData = {
          answer_text: 'The nearest available charging station has been selected.',
          intent: 'find_nearest_station',
          entities: {
            congestion: 'medium'
          }
        };
      } else if (
        normalizedQuery.includes('low congestion') ||
        normalizedQuery.includes('less busy') ||
        normalizedQuery.includes('not busy')
      ) {
        fakeData = {
          answer_text: 'A less busy charging station has been selected for you.',
          intent: 'find_low_congestion',
          entities: {
            congestion: 'low'
          }
        };
      } else if (
        normalizedQuery.includes('high congestion') ||
        normalizedQuery.includes('busy')
      ) {
        fakeData = {
          answer_text: 'A busy charging station was identified. You may want to avoid it.',
          intent: 'find_high_congestion',
          entities: {
            congestion: 'high'
          }
        };
      }

      setResult(fakeData);

      if (onQueryResult) {
        onQueryResult(fakeData);
      }

      console.log('Intent:', fakeData.intent);
      console.log('Entities:', fakeData.entities);
      setLoading(false);
    }, 700);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError('');
    resetTranscript();

    if (listening) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }
  };

  const applyQuickSuggestion = (text) => {
    setQuery(text);
    setError('');
    setResult(null);
  };

  return (
    <div className="voice-query-container">
      <div className="voice-query-card">
        <h2 className="voice-query-title">Voice Query Assistant</h2>
        <p className="voice-query-subtitle">
          Ask about nearby chargers, cost, or congestion status.
        </p>

        <form onSubmit={handleSubmit} className="voice-query-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />

            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Try: nearest charger, cheapest station, or low congestion"
              className="search-input"
              disabled={loading}
            />

            <button
              type="button"
              onClick={handleMicrophoneClick}
              className={`mic-button ${isRecording ? 'recording' : ''}`}
              disabled={loading}
              title={listening ? 'Stop recording' : 'Start voice input'}
            >
              {listening ? (
                <MicOff className="mic-icon active" />
              ) : (
                <Mic className="mic-icon" />
              )}
            </button>
          </div>

          <div className="quick-suggestions">
            <button
              type="button"
              onClick={() => applyQuickSuggestion('nearest charger')}
            >
              Nearest
            </button>
            <button
              type="button"
              onClick={() => applyQuickSuggestion('cheapest station')}
            >
              Cheapest
            </button>
            <button
              type="button"
              onClick={() => applyQuickSuggestion('low congestion')}
            >
              Low congestion
            </button>
          </div>

          {listening && (
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              Recording... Please speak
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="submit-button"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" />
                  Querying...
                </>
              ) : (
                'Submit Query'
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="result-panel">
            <h3 className="result-title">Query Result</h3>

            <div className="result-content">
              <p className="answer-text">{result.answer_text}</p>

              <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
                Based on current system estimation.
              </div>

              <div style={{ marginTop: '12px', fontSize: '14px', color: '#475569' }}>
                <p><strong>Intent:</strong> {result.intent || 'N/A'}</p>
                <p><strong>Congestion:</strong> {result.entities?.congestion || 'N/A'}</p>
              </div>
            </div>

            <div className="debug-info">
              <small>Note: intent and entities are logged to the browser console</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceQuery;