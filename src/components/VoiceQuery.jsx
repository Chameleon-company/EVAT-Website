import { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Loader2 } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/VoiceQuery.css';

const API_URL = import.meta.env.VITE_API_URL;
const buildVoiceQueryEndpoint = () => {
  const baseUrl = (API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}/voice/query`;
  }
  return `${baseUrl}/api/voice/query`;
};

const getUserLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 30000 }
    );
  });

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

  const handleSubmit = async (e) => {
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

    try {
      const userLocation = await getUserLocation();
      const response = await fetch(buildVoiceQueryEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          user_location: userLocation,
        }),
      });

      const rawText = await response.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (parseError) {
        data = null;
      }

      if (!response.ok) {
        setResult(null);
        const serverMessage =
          data?.message ||
          (rawText && rawText.trim()) ||
          `Request failed (${response.status})`;
        setError(serverMessage);
        return;
      }

      setResult(data || null);
      if (onQueryResult) {
        onQueryResult({
          ...data,
          user_location: userLocation,
        });
      }

      console.log('Intent:', data.intent);
      console.log('Entities:', data.entities);
      console.log('Station ID:', data.station_id);
    } catch (err) {
      console.error('Error querying voice API:', err);
      setResult(null);
      setError('Network error or server not responding, please try again later');
    } finally {
      setLoading(false);
    }
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
                <p>
                  <strong>Congestion:</strong>{' '}
                  {result.entities?.congestion || result.entities?.congestion_level || 'N/A'}
                </p>
                <p><strong>Station ID:</strong> {result.station_id || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceQuery;