import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, MessageSquare, Wrench, AlertCircle } from 'lucide-react';

export const NotificationDropdown = ({ onClose, onSelectComplaint }) => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'STATUS_CHANGE':
        return <Wrench size={16} color="#38bdf8" />;
      case 'COMMENT':
        return <MessageSquare size={16} color="#a78bfa" />;
      case 'ASSIGNMENT':
        return <AlertCircle size={16} color="#fbbf24" />;
      default:
        return <Bell size={16} color="#4f46e5" />;
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-popover" ref={dropdownRef}>
      <div style={{
        padding: '0.85rem 1rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.1rem 0.4rem',
              borderRadius: '999px'
            }}>
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-outline"
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`notification-item ${!item.read ? 'unread' : ''}`}
              onClick={() => {
                if (!item.read) markAsRead(item._id);
                if (item.complaint && onSelectComplaint) {
                  onSelectComplaint(item.complaint._id || item.complaint);
                  onClose();
                }
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.message}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {formatTime(item.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
