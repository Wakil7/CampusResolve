import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ComplaintCard } from '../components/ComplaintCard';
import { Globe, Flame, Clock, Search, Filter } from 'lucide-react';

export const PublicFeed = ({ onSelectComplaint, refreshKey }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('trending'); // 'trending' | 'latest'
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFeed();
  }, [sort, category, search, refreshKey]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;

      const res = await api.getPublicFeed(params);
      if (res.success) {
        setFeed(res.data);
      }
    } catch (err) {
      console.error('Failed to load public feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await api.toggleUpvote(id);
      if (res.success) {
        setFeed((prev) =>
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

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Globe size={18} /> Campus Community Voice
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.3rem' }}>Public Complaints Feed</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '680px', marginTop: '0.35rem' }}>
          Browse open issues affecting fellow students across campus. Upvote issues you are also facing ("Me-Too") to help authorities prioritize urgent infrastructure fixes.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search community issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '160px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

        {/* Sort Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${sort === 'trending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSort('trending')}
          >
            <Flame size={14} /> Most Upvoted
          </button>
          <button
            type="button"
            className={`btn btn-sm ${sort === 'latest' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSort('latest')}
          >
            <Clock size={14} /> Latest
          </button>
        </div>
      </div>

      {/* Feed Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '1.5rem' }}>
            ⏳
          </div>
          <div>Loading campus feed...</div>
        </div>
      ) : feed.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.2rem' }}>No Public Complaints Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            No complaints currently match this filter in the campus public feed.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {feed.map((item) => (
            <ComplaintCard
              key={item._id}
              complaint={item}
              onClick={() => onSelectComplaint(item._id)}
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
