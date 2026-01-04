import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Mail, Eye, EyeOff, KeyRound, User, Phone } from 'lucide-react';

import '../styles/Root.css';
import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

const API_URL = import.meta.env.VITE_API_URL;
const url = `${API_URL}/auth/register`;

function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  //Update form on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  //Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitted(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        alert(`Sign Up successful: ${data.message}, welcome ${form.firstName}`);
        navigate('/signin');
      } else {
        setErrorMessage(data.message || "Sign up failed");
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="container vertical center">
      <img src="../src/assets/logo.png" alt="EV Adoption Tool" className="logo-image" />

      <form onSubmit={handleSubmit} className="form-section">
        <label className='form-label required'>First Name</label>
        <div className='icon-inside-input'>
          <User className="input-icon" />
          <input
            className="input"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <label className='form-label required'>Last Name</label>
        <div className='icon-inside-input'>
          <User className="input-icon" />
          <input
            className="input"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <label className='form-label required'>Mobile Number</label>
        <div className='icon-inside-input'>
          <Phone className="input-icon" />
          <input
            className="input"
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            pattern="04\d{8}" // Australian format: starts with 04 + 8 digits
            required
          />
        </div>

        <label className='form-label required'>Email</label>
        <div className='icon-inside-input'>
          <Mail className="input-icon"/>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <label className='form-label required'>Password</label>
        <div className='icon-inside-input'>
          <KeyRound className="input-icon" />
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="input-icon-end"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <div className="spacer-small">  </div>

        <button 
          className="btn btn-primary"
          type="submit" 
        >
          CREATE ACCOUNT
        </button>

        <button
          className="btn btn-transparent"
          onClick={() => navigate('/')}
        >
          BACK TO SIGN IN
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {submitted && <p className="success-message">Signup successful!</p>}
      </form>
    </div>
  );
}

export default Signup;
