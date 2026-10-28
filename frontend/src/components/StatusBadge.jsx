import React from 'react';
import { Clock, Eye, Wrench, CheckCircle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={12} /> Pending
        </span>
      );
    case 'In Review':
      return (
        <span className="badge badge-in-review">
          <Eye size={12} /> In Review
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-in-progress">
          <Wrench size={12} /> In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="badge badge-resolved">
          <CheckCircle size={12} /> Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} /> Rejected
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};

export const PriorityBadge = ({ priority }) => {
  const p = priority?.toLowerCase() || 'medium';
  return (
    <span className={`priority-tag priority-${p}`}>
      {priority === 'Urgent' && '🔥 '}
      {priority} Priority
    </span>
  );
};
