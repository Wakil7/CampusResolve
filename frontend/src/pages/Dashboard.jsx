import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/ComplaintCard';
import {
  Search,
  Filter,
  Plus,
  Clock,
  Wrench,
  CheckCircle,
  Download,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

export const Dashboard = ({ onSelectComplaint, onOpenNewComplaint, refreshKey }) => {
  const { user, isResolver, isAdmin, isStudent } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToMe, setAssignedToMe] = useState(false);

  // Summary counts
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (assignedToMe) params.assignedToMe = 'true';

      const res = await api.getComplaints(params);
      if (res.success) {
        setComplaints(res.data);

        // Update counts
        const allData = res.data;
        setCounts({
          total: res.total || allData.length,
          pending: allData.filter((c) => c.status === 'Pending' || c.status === 'In Review').length,
          inProgress: allData.filter((c) => c.status === 'In Progress').length,
          resolved: allData.filter((c) => c.status === 'Resolved').length,
        });
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, priorityFilter, assignedToMe]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints, refreshKey]);

  const handleUpvote = async (id) => {
    try {
      const res = await api.toggleUpvote(id);
      if (res.success) {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                  ...c,
                  hasUpvoted: res.hasUpvoted,
                  upvoteCount: res.upvoteCount,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (complaints.length === 0) return;
    const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Location', 'Complainant', 'Date'];
    const rows = complaints.map((c) => [
      c.ticketId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      c.isAnonymous ? 'Anonymous' : (c.complainant?.name || 'N/A'),
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="main-content">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role === 'student' ? 'Student Workspace' : `${user?.department || 'Administration'} Control Center`}
          </span>
          <h1 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '580px', marginTop: '0.35rem' }}>
            {isStudent
              ? 'Track the status of your complaints, collaborate with technicians, and review resolutions.'
              : 'Monitor submitted campus complaints, assign resources, and resolve issues effectively.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenNewComplaint}>
            <Plus size={16} /> Lodge New Complaint
          </button>
          {(isResolver || isAdmin) && (
            <button className="btn btn-secondary" onClick={exportToCSV} title="Export CSV Report">
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8' }}>
            <FolderOpen size={22} />
          </div>
          <div>
            <div className="stat-val">{counts.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">{counts.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <Wrench size={22} />
          </div>
          <div>
            <div className="stat-val">{counts.inProgress}</div>
            <div className="stat-label">Under Investigation</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-val">{counts.resolved}</div>
            <div className="stat-label">Resolved Issues</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search tickets by title, keyword, location, or ticket ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '130px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Category Filter */}
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '150px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Hostel">Hostel</option>
          <option value="Academic">Academic</option>
          <option value="Maintenance & Infrastructure">Maintenance</option>
          <option value="Mess & Canteen">Mess & Canteen</option>
          <option value="IT & Labs">IT & Labs</option>
          <option value="Safety & Security">Safety & Security</option>
          <option value="Other">Other</option>
        </select>

        {/* Priority Filter */}
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '120px' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="Urgent">Urgent 🔥</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Assigned to Me shortcut for Staff */}
        {isResolver && (
          <button
            type="button"
            className={`btn btn-sm ${assignedToMe ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAssignedToMe(!assignedToMe)}
          >
            {assignedToMe ? '✓ Assigned to Me' : 'Assigned to Me'}
          </button>
        )}
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '1.5rem' }}>
            ⏳
          </div>
          <div>Loading complaints...</div>
        </div>
      ) : complaints.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <AlertCircle size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>No Complaints Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            {search || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting filters.'
              : isStudent
              ? "You haven't filed any complaints yet. Need assistance with hostel, mess, or labs? Click below."
              : 'There are currently no active complaints matching this view.'}
          </p>
          {isStudent && (
            <button className="btn btn-primary" onClick={onOpenNewComplaint}>
              <Plus size={16} /> File Your First Complaint
            </button>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {complaints.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              onClick={() => onSelectComplaint(c._id)}
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
