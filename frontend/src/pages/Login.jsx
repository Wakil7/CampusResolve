import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertCircle, ArrowRight } from 'lucide-react';
import { GuestNavbar } from '../components/GuestNavbar';

export const Login = ({ onSwitchToRegister, onBackToHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNav = (destination) => {
    if (destination === 'register' && onSwitchToRegister) {
      onSwitchToRegister();
    } else if (destination === 'home' && onBackToHome) {
      onBackToHome();
    }
  };

  return (
    <div className="auth-page">
      {/* Top Navbar matching Homepage */}
      <GuestNavbar activePage="login" onNavigate={handleNav} />

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.6rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <ShieldAlert size={22} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Welcome Back</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Sign in to ResolveCampus Grievance Portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                color: '#f87171',
                fontSize: '0.78rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.6rem' }}
              disabled={submitting}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Demo Credentials Info for Local Offline Testing */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              💡 Default Local Test Accounts:
            </div>
            <div>• Student: <code>abdul@example.com</code> / <code>password123</code></div>
            <div>• Resolver: <code>sahil@example.com</code> / <code>password123</code></div>
            <div>• Admin: <code>sohaib@example.com</code> / <code>password123</code></div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
