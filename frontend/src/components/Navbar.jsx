import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';
import {
  ShieldAlert,
  Plus,
  Bell,
  LayoutDashboard,
  Users,
  BarChart3,
  Globe,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

export const Navbar = ({ currentTab, setTab, onOpenNewComplaint, onSelectComplaint }) => {
  const { user, logout, isResolver, isAdmin } = useAuth();
  const { unreadCount, isOpen: notifOpen, setIsOpen: setNotifOpen } = useNotifications();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setTab('dashboard')}>
          <div className="brand-icon-box">
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ lineHeight: 1.1 }}>Resolve<span style={{ color: '#38bdf8' }}>Campus</span></div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              Complaints Management System
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-links">
          <button
            className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'feed' ? 'active' : ''}`}
            onClick={() => setTab('feed')}
          >
            <Globe size={16} />
            <span>Campus Feed</span>
          </button>

          {isResolver && (
            <button
              className={`nav-link ${currentTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setTab('analytics')}
            >
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>
          )}

          {isAdmin && (
            <button
              className={`nav-link ${currentTab === 'users' ? 'active' : ''}`}
              onClick={() => setTab('users')}
            >
              <Users size={16} />
              <span>Users</span>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* New Complaint Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenNewComplaint}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Plus size={16} />
            <span>Lodge Complaint</span>
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                padding: 0,
                position: 'relative',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-surface)',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationDropdown
                onClose={() => setNotifOpen(false)}
                onSelectComplaint={onSelectComplaint}
              />
            )}
          </div>

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.35rem 0.6rem',
                background: 'var(--btn-secondary-bg)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Avatar name={user?.name} size={28} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                <span className={`role-badge ${user?.role}`}>{user?.role}</span>
              </div>
              <ChevronDown size={14} color="var(--text-dim)" />
            </div>

            {profileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  padding: '0.75rem',
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  {user?.department && (
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>
                      Dept: {user.department}
                    </div>
                  )}
                  {user?.studentId && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                      ID: {user.studentId} {user.roomNumber ? `• ${user.roomNumber}` : ''}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
