import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ style = {}, size = 'md' }) => {
  const { isDark, toggleTheme } = useTheme();

  const isSmall = size === 'sm';
  const buttonDimensions = isSmall ? '34px' : '38px';
  const iconSize = isSmall ? 16 : 18;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: buttonDimensions,
        height: buttonDimensions,
        minWidth: buttonDimensions,
        minHeight: buttonDimensions,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        background: 'var(--btn-secondary-bg)',
        border: '1px solid var(--border-subtle)',
        color: isDark ? '#fbbf24' : '#6366f1',
        cursor: 'pointer',
        transition: 'all var(--transition-smooth)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 0 12px rgba(251, 191, 36, 0.15)'
          : '0 0 12px rgba(99, 102, 241, 0.15)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(360deg) scale(1)',
        }}
      >
        {isDark ? (
          <Sun size={iconSize} className="theme-toggle-icon" />
        ) : (
          <Moon size={iconSize} className="theme-toggle-icon" />
        )}
      </div>
    </button>
  );
};
