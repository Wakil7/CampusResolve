import React from 'react';
import { ShieldAlert, LogIn, UserPlus, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const GuestNavbar = ({ activePage = 'home', onNavigate }) => {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0.75rem 1.5rem',
        transition: 'background-color var(--transition-smooth), border-color var(--transition-smooth)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          onClick={() => onNavigate && onNavigate('home')}
        >
          <div className="brand-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
            <ShieldAlert size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1, color: 'var(--text-main)' }}>
              Resolve<span style={{ color: '#38bdf8' }}>Campus</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              Complaints Management System
            </div>
          </div>
        </div>

        {/* Guest Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {activePage !== 'home' && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => onNavigate && onNavigate('home')}
            >
              <Home size={13} /> Home
            </button>
          )}

          <button
            className={`btn ${activePage === 'login' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            onClick={() => onNavigate && onNavigate('login')}
          >
            <LogIn size={13} /> Sign In
          </button>

          <button
            className={`btn ${activePage === 'register' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            onClick={() => onNavigate && onNavigate('register')}
          >
            <UserPlus size={13} /> Register
          </button>
        </div>
      </div>
    </header>
  );
};
