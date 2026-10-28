import React from 'react';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { ThumbsUp, MapPin, Calendar, User, Star } from 'lucide-react';

export const ComplaintCard = ({
  complaint,
  onClick,
  onUpvote,
  showComplainant = true,
}) => {
  const isUrgent = complaint.priority === 'Urgent';

  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(complaint._id);
    }
  };

  return (
    <div
      className={`complaint-card ${isUrgent ? 'urgent-highlight' : ''}`}
      onClick={() => onClick(complaint)}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="ticket-id">{complaint.ticketId}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Title */}
        <h3 className="complaint-title">{complaint.title}</h3>

        {/* Description snippet */}
        <p className="complaint-desc">{complaint.description}</p>
      </div>

      <div>
        {/* Location & Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '0.75rem 0', fontSize: '0.775rem' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            color: 'var(--text-muted)'
          }}>
            📁 {complaint.category}
          </span>

          {complaint.location && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--text-dim)'
            }}>
              <MapPin size={13} /> {complaint.location}
            </span>
          )}

          {complaint.feedback?.rating && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#fbbf24',
              fontWeight: 700
            }}>
              <Star size={13} fill="#fbbf24" /> {complaint.feedback.rating}/5
            </span>
          )}
        </div>

        {/* Card Footer Metadata */}
        <div className="complaint-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showComplainant && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} />
                {complaint.isAnonymous ? 'Anonymous Student' : (complaint.complainant?.name || 'Student')}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} />
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>

          {complaint.publicToCampus && (
            <button
              className={`upvote-button ${complaint.hasUpvoted ? 'upvoted' : ''}`}
              onClick={handleUpvoteClick}
              title="I am also facing this issue"
            >
              <ThumbsUp size={13} fill={complaint.hasUpvoted ? '#38bdf8' : 'none'} />
              <span>{complaint.upvoteCount || complaint.upvotes?.length || 0}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
