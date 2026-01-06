// NOTE: Might consider more detailed issue selection.

// e.g. multi-level categories (Billing > Refund), multi-select tags (app crash, GPS, map),
// dynamic fields per issue (station ID picker),
// file upload, contact preference,
// auto-attach context (last booking/station used).

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Mail, User } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'

const API_URL = import.meta.env.VITE_API_URL
const SUPPORT_ENDPOINT = `${API_URL}/support-requests`;
const RECENT_SUCCESS_MESSAGE_LINGER = 5000; // 5 seconds * 1000

export default function SupportRequestForm() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isIssueEmpty, setIsIssueEmpty] = useState(false);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
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

  // auto-clear the warning after 30 seconds so it doesn't linger forever
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
    const isIssueEmpty = issue.trim() === '';
    const isDescriptionEmpty = description.trim() === '';

    setIsNameEmpty(isNameEmpty);
    setIsEmailEmpty(isEmailEmpty);
    setIsIssueEmpty(isIssueEmpty);
    setIsDescriptionEmpty(isDescriptionEmpty);
    setError(null); // Clear previous errors

    if (!isNameEmpty && !isEmailEmpty && !isIssueEmpty && !isDescriptionEmpty) {
      handleSubmit(e);
    }
  };

  const getUserId = () => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (submitting) return;

    const userId = getUserId();
    if (!userId) {
      setError('Please sign in first.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(SUPPORT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(userId),
        },
        body: JSON.stringify({
          name: name,
          email: email,
          issue: issue,
          description: description,
        }),
      });

      let data;
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Submit failed (${res.status})`);
      }

      // Save locally (optional quick UX)
      const prev = JSON.parse(localStorage.getItem("supportRequests") || "[]");
      localStorage.setItem("supportRequests", JSON.stringify([...prev, data]));

      // Clear success message after 5 seconds
      setSuccess(`Support request submitted! ${data.reference ? `Reference: ${data.reference}` : ""}`);
      setRecentSuccess(true);
      
      // Reset form
      setName(name);
      setEmail(email);
      setIssue('');
      setDescription('');
    } catch (err) {
      setError('Unable to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container vertical inner">
      <h2 className="center">Submit a Request</h2>
      
      <form onSubmit={handleValidation} className="form-section">
        {/* Submit Error and Success Messages */}
        {error && <ErrorMessage error={error}/>}
        {success && <SuccessMessage message={success}/>}
        <div className="spacer-small">  </div>
        
        {/* Enter Name */}
        <label className='form-label required'>Name</label>
        <div className='icon-inside-input'>
          <User className="input-icon" />
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Name Error Message */}
        {isNameEmpty && <ErrorMessage error='required'/>}

        {/* Enter Email */}
        <label className='form-label required'>Email</label>
        <div className='icon-inside-input'>
          <Mail className="input-icon" />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Email Error Message */}
        {isEmailEmpty && <ErrorMessage error='required'/>}

        {/* Enter Issue */}
        <label className='form-label required'>Issue Type</label>
        <select
          name="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        >
          <option value="">Select Issue Type</option>
          <option value="station">Can't Find a Station</option>
          <option value="payment">Payment Issue</option>
          <option value="info">Incorrect Station Info</option>
          <option value="other">Other</option>
        </select>
        <div className="spacer-small">  </div>
        {/* Issue Error Message */}
        {isIssueEmpty && <ErrorMessage error='required'/>}

        {/* Enter Description */}
        <label className='form-label required'>Description of Issue</label>
        <textarea
          name="description"
          placeholder="Describe your issue..."
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="spacer-small">  </div>
        {/* Description Error Message */}
        {isDescriptionEmpty && <ErrorMessage error='required'/>}

        <div className="spacer-small" />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}