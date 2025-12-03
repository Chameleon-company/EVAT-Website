import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User, Phone } from 'lucide-react';
import '../styles/Style.css';

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
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src="/chameleon.png" alt="Chameleon" className="logo-image" />

        <div className='input-container'>
          <label className="auth-label">First Name</label>
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>
          {validationErrors.firstName && (
            <div className="error-message">
              {validationErrors.firstName}
            </div>
          )}
        </div>

        <div className='input-container'>
          <label className="auth-label">Last Name</label>
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>
          {validationErrors.lastName && (
            <div className="error-message">
              {validationErrors.lastName}
            </div>
          )}
        </div>

        <div className='input-container'>
          <label className="auth-label">Mobile Number</label>
          <div className="input-group">
            <Phone className="icon" />
            <input
              type="tel"
              name="mobile"
              placeholder="04XXXXXXXX"
              value={form.mobile}
              onChange={handleChange}
              className="input"
            />
          </div>
          {validationErrors.mobile && (
            <div className="error-message">
              {validationErrors.mobile}
            </div>
          )}
        </div>

        <div className='input-container'>
          <label className="auth-label">Email</label>
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          {validationErrors.email && (
            <div className="error-message">
              {validationErrors.email}
            </div>
          )}
        </div>

        <div className='input-container'>
          <label className="auth-label">Password</label>
          <div className="input-group">
            <KeyRound className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              className="input"
            />
            <span
              className="icon-right"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {validationErrors.password && (
            <div className="error-message">
              {validationErrors.password}
            </div>
          )}
        </div>

        <div className="button-group">
            <button type="submit" className="auth-button">
              CREATE ACCOUNT
            </button>

            <button
              type="button"
              className="auth-button"
              onClick={() => navigate('/')}
            >
              BACK TO SIGN IN
            </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {submitted && <p className="success-message">Signup successful!</p>}
      </form>
    </div>
  );
}

export default Signup;
