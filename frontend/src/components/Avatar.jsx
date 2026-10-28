import React from 'react';

const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5, #06b6d4)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #059669, #10b981)',
  'linear-gradient(135deg, #f59e0b, #ea580c)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
];

export const Avatar = ({ name = 'User', size = 32 }) => {
  const initials = (name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Deterministic gradient selection based on name
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradient = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: gradient,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: `${Math.round(size * 0.42)}px`,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        userSelect: 'none',
      }}
      title={name}
    >
      {initials}
    </div>
  );
};
