import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Star,
  TrendingUp,
  BarChart2,
  PieChart,
} from 'lucide-react';

export const AnalyticsCharts = ({ data }) => {
  if (!data || !data.summary) return null;

  const { summary, categoryStats, priorityStats, statusStats } = data;

  const statusColors = {
    Pending: '#fbbf24',
    'In Review': '#38bdf8',
    'In Progress': '#a78bfa',
    Resolved: '#34d399',
    Rejected: '#f87171',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 4 Key Stat Cards */}
      <div className="grid-4">
        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div className="stat-val">{summary.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{summary.resolutionRate}%</div>
            <div className="stat-label">Resolution Rate ({summary.resolved} solved)</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-val">{summary.urgentCount}</div>
            <div className="stat-label">Active Urgent Cases</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Star size={24} />
          </div>
          <div>
            <div className="stat-val">{summary.avgRating > 0 ? `${summary.avgRating} / 5` : 'N/A'}</div>
            <div className="stat-label">Student Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Grid 2: Status Distribution & Category Breakdown */}
      <div className="grid-2">
        {/* Status Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Complaint Status Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(statusStats).map(([status, count]) => {
              const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: statusColors[status] || '#fff' }}>
                      {status}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: statusColors[status] || 'var(--primary)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Complaints by Category</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryStats && categoryStats.map((cat) => {
              const percentage = summary.total > 0 ? Math.round((cat.count / summary.total) * 100) : 0;
              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat._id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {cat.count} total • {cat.resolved} solved
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Stats: Speed & Users */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <Clock size={28} color="#38bdf8" style={{ margin: '0 auto 0.75rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {summary.avgResolutionHours > 0 ? `${summary.avgResolutionHours} hrs` : '< 24 hrs'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avg. Resolution Turnaround</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa', marginBottom: '0.25rem' }}>
            {summary.totalStudents}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Students Enrolled</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
            {summary.totalStaff}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Resolvers & Staff</div>
        </div>
      </div>
    </div>
  );
};
