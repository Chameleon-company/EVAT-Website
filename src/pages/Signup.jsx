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
              required
              className="input"
            />
          </div>
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
              required
              className="input"
            />
          </div>
        </div>

        <div className='input-container'>
          <label className="auth-label">Mobile Number</label>
          <div className="input-group">
            <Phone className="icon" />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              pattern="04\d{8}" // Australian format: starts with 04 + 8 digits
              required
              className="input"
            />
          </div>
        </div>

        <div className='input-container'>
          <label className="auth-label">Email</label>
          <div className="input-group">
            <User className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        <div className='input-container'>
          <label className="auth-label">Password</label>
          <div className="input-group">
            <KeyRound className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
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
