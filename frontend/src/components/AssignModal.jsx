import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, UserCheck } from 'lucide-react';

export const AssignModal = ({ complaint, isOpen, onClose, onAssigned }) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDepartment(complaint?.assignedDepartment || 'Maintenance & Infrastructure');
      setSelectedStaffId(complaint?.assignedTo?._id || '');
      fetchStaff();
    }
  }, [isOpen, complaint]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.getStaffList();
      if (res.success) {
        setStaffList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.assignComplaint(complaint._id, {
        staffId: selectedStaffId || null,
        department,
      });
      if (res.success) {
        onAssigned(res.data);
        onClose();
      }
    } catch (err) {
      alert(err.message || 'Failed to assign complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Assign Resolver</h3>
          </div>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ width: '30px', height: '30px', padding: 0, borderRadius: '50%' }}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Ticket: <strong style={{ color: 'var(--text-main)' }}>{complaint?.ticketId}</strong> — {complaint?.title}
            </div>

            <div className="form-group">
              <label className="form-label">Responsible Department</label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Maintenance & Infrastructure">Maintenance & Infrastructure</option>
                <option value="Hostel">Hostel Affairs</option>
                <option value="Academic">Academic Affairs</option>
                <option value="Mess & Canteen">Mess & Canteen</option>
                <option value="IT & Labs">IT & Computer Center</option>
                <option value="Safety & Security">Safety & Security</option>
                <option value="General">General Administration</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign Specific Resolver / Staff Member</label>
              <select
                className="form-control"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                <option value="">-- Choose Resolver --</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.department || staff.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
