import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, KeyRound, User, Phone } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'

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
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  });
  const navigate = useNavigate();

  //Update form on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    // Clear validation error for this field when user types
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  //Validate form fields
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // First Name validation
    if (form.firstName.trim() === '') {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (form.firstName.trim().length < 1 || form.firstName.trim().length > 40) {
      errors.firstName = 'The name must be at least 1 character and no more than 40 characters';
      isValid = false;
    }

    // Last Name validation
    if (form.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (form.lastName.trim().length < 1 || form.lastName.trim().length > 40) {
      errors.lastName = 'The name must be at least 1 character and no more than 40 characters';
      isValid = false;
    }

    // Email validation
    if (form.email.trim() === '') {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Mobile validation (Australian format)
    if (form.mobile.trim() === '') {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^04\d{8}$/.test(form.mobile)) {
      errors.mobile = 'Mobile must be in format 04XXXXXXXX (10 digits)';
      isValid = false;
    }

    // Password validation
    if (form.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  //Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setSubmitted(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          mobile: mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Sign Up successful: ${data.message}, welcome ${firstName}`);
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

      <form onSubmit={handleSubmit} className="form-section signin-width">
        {/* Submit Error and Success Messages */}
        {errorMessage && <ErrorMessage error={errorMessage}/>}
        {submitted && <SuccessMessage message='Signup successful!'/>}
        <div className="spacer-small">  </div>

        {/* Enter First Name */}
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
          />
        </div>
        <div className="spacer-small">  </div>
        {/* First Name Error Message */}
        {validationErrors.firstName && <ErrorMessage error={validationErrors.firstName}/>}

        {/* Enter Last Name */}
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
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Last Name Error Message */}
        {validationErrors.lastName && <ErrorMessage error={validationErrors.lastName}/>}

        {/* Enter Mobile */}
        <label className='form-label required'>Mobile Number</label>
        <div className='icon-inside-input'>
          <Phone className="input-icon" />
          <input
            className="input"
            type="tel"
            name="mobile"
            placeholder="04XXXXXXXX"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Mobile Error Message */}
        {validationErrors.mobile && <ErrorMessage error={validationErrors.mobile}/>}

        {/* Enter Email */}
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
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Email Error Message */}
        {validationErrors.email && <ErrorMessage error={validationErrors.email}/>}

        {/* Enter Password */}
        <label className='form-label required'>Password</label>
        <div className='icon-inside-input'>
          <KeyRound className="input-icon" />
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={handleChange}
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
        {/* Password Error Message */}
        {validationErrors.password && <ErrorMessage error={validationErrors.password}/>}

        <div className="spacer-small">  </div>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          CREATE ACCOUNT
        </button>
        <button
          type='button'
          className="btn btn-transparent"
          onClick={() => navigate('/')}
        >
          BACK TO SIGN IN
        </button>
      </form>
    </div>
  );
}

export default Signup;
