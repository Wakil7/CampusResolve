import React from 'react';
import { Check, Clock, Eye, Wrench, CheckCircle2 } from 'lucide-react';

export const Timeline = ({ status }) => {
  const steps = [
    { key: 'Pending', label: 'Registered', icon: Clock },
    { key: 'In Review', label: 'In Review', icon: Eye },
    { key: 'In Progress', label: 'In Progress', icon: Wrench },
    { key: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
  ];

  const getStepIndex = (s) => {
    switch (s) {
      case 'Pending':
        return 0;
      case 'In Review':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      case 'Rejected':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  if (status === 'Rejected') {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        color: '#f87171',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ⚠️ This complaint was reviewed and closed as rejected. Check resolution details for remarks.
      </div>
    );
  }

  return (
    <div className="tracker-container">
      {steps.map((step, idx) => {
        const isCompleted = currentIndex > idx;
        const isActive = currentIndex === idx;
        const IconComponent = step.icon;

        return (
          <div
            key={step.key}
            className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="step-node">
              {isCompleted ? <Check size={16} /> : <IconComponent size={14} />}
            </div>
            <span className="step-title">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
