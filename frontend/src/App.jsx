import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { PublicFeed } from './pages/PublicFeed';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NewComplaintModal } from './components/NewComplaintModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';

export const App = () => {
  const { user, loading, isAuthenticated, isResolver, isAdmin } = useAuth();
  const [currentTab, setTab] = useState('dashboard');
  const [guestView, setGuestView] = useState('home'); // 'home' | 'login' | 'register'
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  // Modal states
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main)',
          color: 'var(--text-muted)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(79, 70, 229, 0.2)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
          }}
          className="animate-spin"
        />
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Initializing ResolveCampus...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (guestView === 'login') {
      return (
        <Login
          onSwitchToRegister={() => setGuestView('register')}
          onBackToHome={() => setGuestView('home')}
        />
      );
    }
    if (guestView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setGuestView('login')}
          onBackToHome={() => setGuestView('home')}
        />
      );
    }
    return <Home onNavigate={setGuestView} />;
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
        onSelectComplaint={(id) => setSelectedComplaintId(id)}
      />

      {/* Main Page Content */}
      <main style={{ flex: 1 }}>
        {currentTab === 'dashboard' && (
          <Dashboard
            refreshKey={refreshKey}
            onSelectComplaint={(id) => setSelectedComplaintId(id)}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
          />
        )}

        {currentTab === 'feed' && (
          <PublicFeed
            refreshKey={refreshKey}
            onSelectComplaint={(id) => setSelectedComplaintId(id)}
          />
        )}

        {currentTab === 'analytics' && isResolver && <AnalyticsPage />}

        {currentTab === 'users' && isAdmin && <AdminUsersPage />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          background: 'var(--footer-bg)',
          transition: 'background-color var(--transition-smooth)',
        }}
      >
        ResolveCampus Complaints Management System • Built with React, Node.js, Express & MongoDB
      </footer>

      {/* New Complaint Modal */}
      {isNewComplaintOpen && (
        <NewComplaintModal
          isOpen={isNewComplaintOpen}
          onClose={() => setIsNewComplaintOpen(false)}
          onSuccess={(newComplaint) => {
            triggerRefresh();
            setSelectedComplaintId(newComplaint._id);
          }}
        />
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaintId && (
        <ComplaintDetailModal
          complaintId={selectedComplaintId}
          isOpen={!!selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
          onComplaintUpdated={() => {
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
};

export default App;
