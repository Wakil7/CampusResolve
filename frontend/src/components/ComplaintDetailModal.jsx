import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Timeline } from './Timeline';
import { AssignModal } from './AssignModal';
import {
  X,
  MapPin,
  Calendar,
  User,
  Send,
  Lock,
  ThumbsUp,
  Star,
  CheckCircle,
  FileText,
  Clock,
  History,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const ComplaintDetailModal = ({
  complaintId,
  isOpen,
  onClose,
  onComplaintUpdated,
}) => {
  const { user, isResolver, isAdmin } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isStaffOnly, setIsStaffOnly] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  // Status update states (Staff/Admin)
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Student Feedback rating states
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Assign modal
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('discussion'); // 'discussion' | 'activity'

  useEffect(() => {
    if (isOpen && complaintId) {
      loadComplaint();
    }
  }, [isOpen, complaintId]);

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaintById(complaintId);
      if (res.success) {
        setComplaint(res.data);
        setNewStatus(res.data.status);
        setResolutionNote(res.data.resolutionDetails?.resolutionNote || '');
      }
    } catch (err) {
      console.error('Failed to load complaint:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSendingComment(true);
    try {
      const res = await api.addComment(complaint._id, {
        message: commentText.trim(),
        isStaffOnly,
      });
      if (res.success) {
        setComplaint((prev) => ({
          ...prev,
          comments: res.data,
        }));
        setCommentText('');
      }
    } catch (err) {
      alert(err.message || 'Failed to send comment');
    } finally {
      setSendingComment(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await api.updateStatus(complaint._id, {
        status: newStatus,
        resolutionNote,
      });
      if (res.success) {
        await loadComplaint();
        if (onComplaintUpdated) onComplaintUpdated(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await api.submitFeedback(complaint._id, {
        rating,
        comment: feedbackComment,
      });
      if (res.success) {
        setComplaint((prev) => ({ ...prev, feedback: res.data }));
        if (onComplaintUpdated) onComplaintUpdated({ ...complaint, feedback: res.data });
      }
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await api.toggleUpvote(complaint._id);
      if (res.success) {
        setComplaint((prev) => ({
          ...prev,
          hasUpvoted: res.hasUpvoted,
          upvoteCount: res.upvoteCount,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isComplainant =
    user && complaint && complaint.complainant?._id?.toString() === user.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '92vh' }}
      >
        {/* Modal Top Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="ticket-id" style={{ fontSize: '0.9rem' }}>
                {complaint?.ticketId || 'CMP-xxxx'}
              </span>
              {complaint && (
                <>
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </>
              )}
            </div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: 1.25 }}>
              {complaint?.title || 'Loading Complaint...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
                ⏳
              </div>
              <div>Retrieving ticket records & timeline...</div>
            </div>
          ) : !complaint ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#f87171' }}>
              Could not find complaint details.
            </div>
          ) : (
            <>
              {/* Lifecycle Step Tracker */}
              <Timeline status={complaint.status} />

              {/* Resolver / Authority Action Panel (for Staff & Admin) */}
              {isResolver && (
                <div
                  style={{
                    background: 'rgba(79, 70, 229, 0.08)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#a5b4fc' }}>
                      🛠️ Authority Control Panel
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setIsAssignOpen(true)}
                    >
                      Assign Staff / Dept
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: '1', minWidth: '160px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Update Status</label>
                      <select
                        className="form-control"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div style={{ flex: '2', minWidth: '220px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Action / Resolution Note</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Technician dispatched or spare parts installed"
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ alignSelf: 'flex-end' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleStatusChange}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Save Status'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaint Overview Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={14} />
                      {complaint.isAnonymous ? 'Anonymous Student' : complaint.complainant?.name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} />
                      {complaint.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} />
                      {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {complaint.publicToCampus && (
                    <button
                      className={`upvote-button ${complaint.hasUpvoted ? 'upvoted' : ''}`}
                      onClick={handleUpvote}
                    >
                      <ThumbsUp size={13} fill={complaint.hasUpvoted ? '#38bdf8' : 'none'} />
                      <span>{complaint.upvoteCount || 0} Me-Too</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {complaint.description}
                </p>

                {/* Attachments */}
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Attachments:
                    </span>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {complaint.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.75rem',
                            color: '#38bdf8',
                          }}
                        >
                          <FileText size={14} />
                          <span>{att.originalName || att.filename}</span>
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned Staff & Department Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Assigned Department: </span>
                  <strong style={{ color: 'var(--text-main)' }}>{complaint.assignedDepartment || 'General'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Assigned Resolver: </span>
                  <strong style={{ color: '#38bdf8' }}>
                    {complaint.assignedTo?.name || 'Pending assignment'}
                  </strong>
                </div>
              </div>

              {/* Resolution Summary Box (if resolved or rejected) */}
              {(complaint.status === 'Resolved' || complaint.resolutionDetails?.resolvedAt) && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={18} color="#10b981" />
                    <span style={{ fontWeight: 700, color: '#34d399' }}>Resolution Details</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {complaint.resolutionDetails?.resolutionNote || 'The complaint has been successfully resolved.'}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Resolved by {complaint.resolutionDetails?.resolvedBy?.name || 'Staff'} on{' '}
                    {new Date(complaint.resolutionDetails?.resolvedAt || complaint.updatedAt).toLocaleDateString()}
                  </div>

                  {/* Feedback Section */}
                  {complaint.feedback?.rating ? (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Student Satisfaction:</span>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              fill={s <= complaint.feedback.rating ? '#fbbf24' : 'none'}
                              color={s <= complaint.feedback.rating ? '#fbbf24' : '#475569'}
                            />
                          ))}
                        </div>
                      </div>
                      {complaint.feedback.comment && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                          "{complaint.feedback.comment}"
                        </p>
                      )}
                    </div>
                  ) : (
                    isComplainant && (
                      <form
                        onSubmit={handleSubmitFeedback}
                        style={{
                          marginTop: '1rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                          How satisfied are you with this resolution?
                        </div>
                        <div className="star-rating" style={{ marginBottom: '0.5rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              type="button"
                              key={s}
                              className={`star-btn ${s <= rating ? 'active' : ''}`}
                              onClick={() => setRating(s)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Optional feedback comment..."
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                          />
                          <button
                            type="submit"
                            className="btn btn-success btn-sm"
                            disabled={submittingFeedback}
                          >
                            {submittingFeedback ? 'Submitting...' : 'Submit Rating'}
                          </button>
                        </div>
                      </form>
                    )
                  )}
                </div>
              )}

              {/* Tabs for Discussion vs Audit Log */}
              <div>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '1rem' }}>
                  <button
                    onClick={() => setActiveTab('discussion')}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === 'discussion' ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === 'discussion' ? '#fff' : 'var(--text-dim)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      padding: '0.5rem 0',
                      cursor: 'pointer',
                    }}
                  >
                    Discussion ({complaint.comments?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === 'activity' ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === 'activity' ? '#fff' : 'var(--text-dim)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      padding: '0.5rem 0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <History size={14} /> Audit Trail ({complaint.activityLog?.length || 0})
                  </button>
                </div>

                {activeTab === 'discussion' ? (
                  <div>
                    {/* Comments list */}
                    <div className="comments-container">
                      {complaint.comments?.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                          No comments yet. Start a discussion with the authority.
                        </div>
                      ) : (
                        complaint.comments.map((cmt, idx) => (
                          <div
                            key={idx}
                            className={`comment-bubble ${cmt.isStaffOnly ? 'staff-note' : ''}`}
                          >
                            <div className="comment-author">
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ color: 'var(--text-main)' }}>{cmt.user?.name || 'User'}</span>
                                {cmt.user?.role && (
                                  <span className={`role-badge ${cmt.user.role}`}>
                                    {cmt.user.role}
                                  </span>
                                )}
                                {cmt.isStaffOnly && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.7rem' }}>
                                    <Lock size={11} /> Internal Note
                                  </span>
                                )}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                                {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="comment-text">{cmt.message}</div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Comment Input */}
                    <form onSubmit={handleSendComment} style={{ marginTop: '0.75rem' }}>
                      {isResolver && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.4rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isStaffOnly}
                            onChange={(e) => setIsStaffOnly(e.target.checked)}
                          />
                          <Lock size={12} /> Post as internal staff-only note (hidden from student)
                        </label>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type an update or reply..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={sendingComment}>
                          <Send size={15} />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Activity Timeline / Audit Trail */
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
                    {complaint.activityLog?.slice().reverse().map((act, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          fontSize: '0.8rem',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <Clock size={15} color="var(--primary)" style={{ marginTop: '2px' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.action}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{act.note}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            By {act.performerName || 'System'} • {new Date(act.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Nested Assign Modal */}
      {isAssignOpen && (
        <AssignModal
          complaint={complaint}
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          onAssigned={(updated) => {
            setComplaint((prev) => ({
              ...prev,
              assignedTo: updated.assignedTo,
              assignedDepartment: updated.assignedDepartment,
              status: updated.status,
            }));
            if (onComplaintUpdated) onComplaintUpdated(updated);
          }}
        />
      )}
    </div>
  );
};
