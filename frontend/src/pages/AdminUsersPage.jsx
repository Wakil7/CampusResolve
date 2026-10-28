import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Avatar } from '../components/Avatar';
import { Users, Search, ShieldCheck, UserCheck } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;

      const res = await api.getAllUsers(params);
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.updateUserRole(userId, { role: newRole });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb923c', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <ShieldCheck size={18} /> Administrative Access
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.3rem' }}>Campus User Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Manage user privileges, staff resolvers, and campus role authorizations.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search users by name, email, or student roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '150px' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="staff">Staff Resolvers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--btn-secondary-bg)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>User Profile</th>
                <th style={{ padding: '1rem 1.25rem' }}>Campus Role</th>
                <th style={{ padding: '1rem 1.25rem' }}>Department / Branch</th>
                <th style={{ padding: '1rem 1.25rem' }}>Student ID / Room</th>
                <th style={{ padding: '1rem 1.25rem' }}>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar name={u.name} size={36} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {u.department || 'General'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {u.studentId ? `${u.studentId}` : ''}
                      {u.roomNumber ? ` (${u.roomNumber})` : ''}
                      {!u.studentId && !u.roomNumber && '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff Resolver</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
