import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await submitFeedback(formData);
      console.log('Feedback submitted successfully:', response);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', suggestion: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container center">
      <h2 className="center">Send Feedback</h2>
      <div>
        <form className="form-section" onSubmit={handleSubmit}>
          
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="validation-success">
              <CheckCircle size={20} />
              <span>Thank you for your feedback! We'll review it and get back to you if needed.</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="validation-error">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}
        
          <label className='form-label required' htmlFor="name">Name</label>
          <input
            className="input form-full-width"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          <label className='form-label required' htmlFor="email">E-Mail</label>
          <div className="email-input-container">
            <Mail className="email-icon" size={16} />
            <input
              className="input form-full-width"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <label className='form-label required' htmlFor="suggestion">Suggestion</label>
          <textarea
            className="input full-width"
            name="suggestion"
            value={formData.suggestion}
            onChange={handleChange}
            placeholder="Enter your suggestion or feedback"
            rows="4"
            required
          />
          <div className='spacer' />
          <button 
            className="btn btn-primary btn-full-width"
            type="submit" 
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
