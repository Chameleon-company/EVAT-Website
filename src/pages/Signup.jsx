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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
  const [isMobileEmpty, setIsMobileEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const handleValidation = (e) => {
    e.preventDefault();

    const isFirstNameEmpty = firstName.trim() === '';
    const isLastNameEmpty = lastName.trim() === '';
    const isMobileEmpty = mobile.trim() === '';
    const isEmailEmpty = email.trim() === '';
    const isPasswordEmpty = password.trim() === '';

    setIsFirstNameEmpty(isFirstNameEmpty);
    setIsLastNameEmpty(isLastNameEmpty);
    setIsMobileEmpty(isMobileEmpty);
    setIsEmailEmpty(isEmailEmpty);
    setIsPasswordEmpty(isPasswordEmpty);
    setError(null); // Clear previous errors

    if (!isFirstNameEmpty && !isLastNameEmpty && !isMobileEmpty && !isEmailEmpty && !isPasswordEmpty) {
      handleSubmit(e);
    }
  };

  //Update form on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  //Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        setError(data.message || "Sign up failed");
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="container vertical center">
      <img src="../src/assets/logo.png" alt="EV Adoption Tool" className="logo-image" />

      <form onSubmit={handleValidation} className="form-section signin-width">
        {/* Submit Error and Success Messages */}
        {error && <ErrorMessage error={error}/>}
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="spacer-small">  </div>
        {/* First Name Error Message */}
        {isFirstNameEmpty && <ErrorMessage error='required'/>}

        {/* Enter Last Name */}
        <label className='form-label required'>Last Name</label>
        <div className='icon-inside-input'>
          <User className="input-icon" />
          <input
            className="input"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Last Name Error Message */}
        {isLastNameEmpty && <ErrorMessage error='required'/>}

        {/* Enter Mobile */}
        <label className='form-label required'>Mobile Number</label>
        <div className='icon-inside-input'>
          <Phone className="input-icon" />
          <input
            className="input"
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="04\d{8}" // Australian format: starts with 04 + 8 digits
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Mobile Error Message */}
        {isMobileEmpty && <ErrorMessage error='required'/>}

        {/* Enter Email */}
        <label className='form-label required'>Email</label>
        <div className='icon-inside-input'>
          <Mail className="input-icon"/>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
          />
        </div>
        <div className="spacer-small">  </div>
        {/* Email Error Message */}
        {isEmailEmpty && <ErrorMessage error='required'/>}

        {/* Enter Password */}
        <label className='form-label required'>Password</label>
        <div className='icon-inside-input'>
          <KeyRound className="input-icon" />
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
        {isPasswordEmpty && <ErrorMessage error='required'/>}

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
