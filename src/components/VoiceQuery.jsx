import { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Loader2 } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/VoiceQuery.css';

const API_URL = import.meta.env.VITE_API_URL;

function VoiceQuery() {
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
    } else {
      setError('');
      resetTranscript();
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      });
      setIsRecording(true);
    }
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
      const response = await fetch(`${API_URL}/voice/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          answer_text: data.answer_text,
          intent: data.intent,
          entities: data.entities
        });

        console.log('Intent:', data.intent);
        console.log('Entities:', data.entities);
        
      } else {
        setError(data.message || 'Query failed, please try again');
      }
    } catch (err) {
      console.error('Error querying voice API:', err);
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

  return (
    <div className="voice-query-container">
      <div className="voice-query-card">
        <h2 className="voice-query-title">Voice Query Assistant</h2>
        
        <form onSubmit={handleSubmit} className="voice-query-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Type your query or click microphone to use voice input..."
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
            </div>
            
            <div className="debug-info">
              <small>Note: Intent and Entities are logged to the browser console</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceQuery;
