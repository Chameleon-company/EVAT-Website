import React, { useState, useEffect } from 'react';
import { Mail, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'

const RECENT_SUCCESS_MESSAGE_LINGER = 5000; // 5 seconds * 1000

function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isSuggestionEmpty, setIsSuggestionEmpty] = useState(false);
  const [recentSuccess, setRecentSuccess] = useState(false);

  // Prefill name/email from currentUser if available
  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;
    try {
      const u = JSON.parse(raw);
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();
      setName(name);
      setEmail(u?.email);

    } catch {/* ignore */}
  }, []);

  // auto-clear the warning after 5 seconds so it doesn't linger forever
  useEffect(() => {
    if (recentSuccess) {
      const timer = setTimeout(() => {
        setRecentSuccess(false);
        setSuccess(false);
      }, RECENT_SUCCESS_MESSAGE_LINGER);
      return () => clearTimeout(timer);
    }
  }, [recentSuccess]);

  const handleValidation = (e) => {
    e.preventDefault();

    const isNameEmpty = name.trim() === '';
    const isEmailEmpty = email.trim() === '';
    const isSuggestionEmpty = suggestion.trim() === '';

    setIsNameEmpty(isNameEmpty);
    setIsEmailEmpty(isEmailEmpty);
    setIsSuggestionEmpty(isSuggestionEmpty);
    setError(null); // Clear previous errors

    if (!isNameEmpty && !isEmailEmpty && !isSuggestionEmpty) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await submitFeedback({
          name: name,
          email: email,
          suggestion: suggestion,
        });
      console.log('Feedback submitted successfully:', response);
      // Clear success message after 5 seconds
      setSuccess("Feedback submitted!");
      setRecentSuccess(true);

      // Reset form
      setName(name);
      setEmail(email);
      setSuggestion('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Unable to submit');
      // setSubmitStatus('error');
      setError(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container vertical center">
      <h2 className="center">Send Feedback</h2>
      <div>
        <form className="form-section" onSubmit={handleValidation}>
          {/* Submit Error and Success Messages */}
          {error && <ErrorMessage error={error}/>}
          {success && <SuccessMessage message={success}/>}
          <div className="spacer-small">  </div>

          {/* Enter Name */}
          <label className='form-label required' htmlFor="name">Name</label>
          <div className='icon-inside-input'>
            <User className="input-icon" />
            <input
              className="input"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="spacer-small">  </div>
          {/* Name Error Message */}
          {isNameEmpty && <ErrorMessage error='required'/>}

          {/* Enter Email */}
          <label className='form-label required' htmlFor="email">E-Mail</label>
          <div className='icon-inside-input'>
            <Mail className="input-icon" />
            <input
              className="input"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
            />
          </div>
          <div className="spacer-small">  </div>
          {/* Email Error Message */}
          {isEmailEmpty && <ErrorMessage error='required'/>}

          {/* Enter Suggestion */}
          <label className='form-label required' htmlFor="suggestion">Suggestion</label>
          <textarea
            className="input"
            name="suggestion"
            placeholder="Enter your suggestion or feedback"
            rows="4"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
          <div className="spacer-small">  </div>
          {/* Suggestion Error Message */}
          {isSuggestionEmpty && <ErrorMessage error='required'/>}

          <div className='spacer-small' />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spinning" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
