import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertCircle, ArrowRight, UserPlus, Shield, UserCheck } from 'lucide-react';
import { GuestNavbar } from '../components/GuestNavbar';

export const Register = ({ onSwitchToLogin, onBackToHome }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // 'student' | 'staff'
    department: 'Maintenance & Infrastructure',
    studentId: '',
    roomNumber: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNav = (destination) => {
    if (destination === 'login' && onSwitchToLogin) {
      onSwitchToLogin();
    } else if (destination === 'home' && onBackToHome) {
      onBackToHome();
    }
  };

  return (
    <div className="auth-page">
      {/* Top Navbar matching Homepage */}
      <GuestNavbar activePage="register" onNavigate={handleNav} />

      <div className="auth-wrapper">
        <div className="auth-card auth-card-wide">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <UserPlus size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Create Your Account</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Join ResolveCampus as a student or authority resolver
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${formData.role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.5rem',
                }}
                onClick={() => setFormData({ ...formData, role: 'student' })}
              >
                <UserCheck size={15} /> 🎓 Student
              </button>
              <button
                type="button"
                className={`btn ${formData.role === 'staff' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.5rem',
                }}
                onClick={() => setFormData({ ...formData, role: 'staff' })}
              >
                <Shield size={15} /> 🛠️ Authority / Resolver
              </button>
            </div>
          </div>

          {/* Staff Department Dropdown */}
          {formData.role === 'staff' && (
            <div
              className="form-group"
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                marginBottom: '0.85rem',
              }}
            >
              <label className="form-label" style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.75rem' }}>
                🛠️ Authority Department *
              </label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.6rem' }}
              >
                <option value="Maintenance & Infrastructure">Maintenance & Infrastructure</option>
                <option value="Hostel">Hostel Affairs</option>
                <option value="Academic">Academic Affairs</option>
                <option value="Mess & Canteen">Mess & Canteen</option>
                <option value="IT & Labs">IT & Labs</option>
                <option value="Safety & Security">Safety & Security</option>
              </select>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                color: '#f87171',
                fontSize: '0.78rem',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Email & Password Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Campus Email *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password * (min 6 chars)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {formData.role === 'student' && (
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CS-2024-042"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hostel / Room</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Block B-302"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
