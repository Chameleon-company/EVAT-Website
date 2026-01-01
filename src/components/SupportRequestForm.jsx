// NOTE: Might consider more detailed issue selection.

// e.g. multi-level categories (Billing > Refund), multi-select tags (app crash, GPS, map),
// dynamic fields per issue (station ID picker),
// file upload, contact preference,
// auto-attach context (last booking/station used).

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import '../styles/Buttons.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/Elements.css';

const API_URL = import.meta.env.VITE_API_URL
const SUPPORT_ENDPOINT = `${API_URL}/support-requests`;

export default function SupportRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Prefill name/email from currentUser if available
  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;
    try {
      const u = JSON.parse(raw);
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        email: u?.email || prev.email,
      }));
    } catch {/* ignore */}
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const userId = getUserId();
    if (!userId) {
      toast.error("Please sign in first.", { position: "top-center" });
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
        body: JSON.stringify(formData),
      });

      let data;
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Submit failed (${res.status})`);
      }

      // Save locally (optional quick UX)
      const prev = JSON.parse(localStorage.getItem("supportRequests") || "[]");
      localStorage.setItem("supportRequests", JSON.stringify([...prev, data]));

      toast.success(
        <div>
          Support request submitted!
          <br />
          {data.reference ? `Reference: ${data.reference}` : ""}
        </div>,
        { position: "top-center", autoClose: 1000, toastId: "support-success" }
      );

      // Reset form
      setFormData({ name: "", email: "", issue: "", description: "" });
    } catch (err) {
      toast.error(err.message || "Failed to submit request.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container center full-width">
      <h2 className="center">Submit a Request</h2>

      <form onSubmit={handleSubmit} className="form-section">
        <label className='form-label required'>Name</label>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className='form-label required'>Email</label>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className='form-label required'>Issue Type</label>
        <select
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          required
        >
          <option value="">Select Issue Type</option>
          <option value="station">Can't Find a Station</option>
          <option value="payment">Payment Issue</option>
          <option value="info">Incorrect Station Info</option>
          <option value="other">Other</option>
        </select>

        <label className='form-label required'>Description of Issue</label>
        <textarea
          name="description"
          placeholder="Describe your issue..."
          rows={5}
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button 
          className="btn btn-primary"
          type="submit" 
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}