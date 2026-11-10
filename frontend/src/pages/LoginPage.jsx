import React, { useState } from 'react';
import { LogIn, Key, Mail, AlertCircle, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigateRegister, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={26} color="#d97706" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your GourmetScore account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="styled-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-control with-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input
                type="password"
                className="form-control with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Evaluation */}
        <div className="quick-creds-box">
          <span className="quick-creds-title">⚡ Quick Role Demo (Click to Autofill):</span>
          <div className="quick-creds-buttons">
            <button
              type="button"
              className="quick-btn admin"
              onClick={() => handleQuickLogin('admin@platform.com', 'Admin@1234')}
            >
              <ShieldCheck size={14} /> Admin
            </button>
            <button
              type="button"
              className="quick-btn owner"
              onClick={() => handleQuickLogin('owner.mario@platform.com', 'Owner@1234')}
            >
              <Store size={14} /> Owner (Mario)
            </button>
            <button
              type="button"
              className="quick-btn customer"
              onClick={() => handleQuickLogin('customer.alex@example.com', 'Customer@1234')}
            >
              <User size={14} /> Customer (Alex)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <span>Don't have an account yet?</span>
          <button type="button" className="btn-link" onClick={onNavigateRegister}>
            Register as Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
