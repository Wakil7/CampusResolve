import React, { useState } from 'react';
import { api } from '../services/api';
import {
  X,
  Upload,
  AlertTriangle,
  Building,
  BookOpen,
  Wrench,
  Utensils,
  Laptop,
  ShieldAlert,
  HelpCircle,
  EyeOff,
  Globe,
  CheckCircle,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Hostel', label: 'Hostel', icon: Building },
  { id: 'Academic', label: 'Academic', icon: BookOpen },
  { id: 'Maintenance & Infrastructure', label: 'Maintenance', icon: Wrench },
  { id: 'Mess & Canteen', label: 'Mess / Canteen', icon: Utensils },
  { id: 'IT & Labs', label: 'IT & Labs', icon: Laptop },
  { id: 'Safety & Security', label: 'Safety & Security', icon: ShieldAlert },
  { id: 'Other', label: 'Other', icon: HelpCircle },
];

export const NewComplaintModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance & Infrastructure',
    priority: 'Medium',
    location: '',
    isAnonymous: false,
    publicToCampus: false,
  });

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 3) {
      setError('You can upload a maximum of 3 attachments.');
      return;
    }
    setError('');
    setFiles((prev) => [...prev, ...selected]);

    // Create previews
    const newPreviews = selected.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setFilePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a complaint title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a detailed description of the problem');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      data.append('location', formData.location.trim() || 'Campus Premises');
      data.append('isAnonymous', formData.isAnonymous);
      data.append('publicToCampus', formData.publicToCampus);

      files.forEach((file) => {
        data.append('attachments', file);
      });

      const res = await api.createComplaint(data);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to lodge complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Lodge a Complaint</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Submit your issue to campus authorities for prompt resolution.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            {/* Category Grid */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="category-picker-grid">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`category-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                    >
                      <Icon size={18} color={isSelected ? '#38bdf8' : 'var(--text-dim)'} />
                      <span>{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Complaint Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Water leakage in 3rd floor washroom or Wi-Fi offline"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={120}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                className="form-control"
                placeholder="Explain the problem thoroughly: what happened, how long has it been broken, and specific details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Priority & Location in 2 Columns */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low (General suggestion/minor)</option>
                  <option value="Medium">Medium (Standard issue)</option>
                  <option value="High">High (Affects multiple students)</option>
                  <option value="Urgent">Urgent (Immediate safety / critical)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Room Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Block B, Room 304"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* File Upload Attachment */}
            <div className="form-group">
              <label className="form-label">Evidence / Photo Attachment (Optional)</label>
              <label
                style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <Upload size={22} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload photos or files</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  PNG, JPG, PDF up to 10MB (Max 3 files)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Previews */}
              {filePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  {filePreviews.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-card)',
                        padding: '0.4rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      <span>📎 {f.name.slice(0, 16)}...</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy & Campus Visibility Toggles */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.publicToCampus}
                  onChange={(e) => setFormData({ ...formData, publicToCampus: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Globe size={14} color="#38bdf8" /> Publish to Campus Community Feed
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Allow other students to upvote and follow this complaint to demonstrate widespread impact.
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <EyeOff size={14} color="#a78bfa" /> Submit Anonymously
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Your name and roll number will be masked from public and non-admin viewers.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
