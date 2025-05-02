import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '', balance: '', walletAddress: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        withCredentials: true,
      });
      if (res.data && onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'} to Bitcoin Mania</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {isRegistering && (
          <input type="text" name="username" placeholder="Username" value={formData.username} autoComplete="username" onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} autoComplete="username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} autoComplete="current-password" onChange={handleChange} required />
        {isRegistering && (
          <>
            <input type="text" name="referredBy" placeholder="Referral Code (optional)" value={formData.referredBy || ''} onChange={handleChange} />
          </>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p onClick={toggleForm} className="toggle-form">
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Login;
