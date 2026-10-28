import React from 'react';
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Building,
  Wrench,
  Utensils,
  Laptop,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { GuestNavbar } from '../components/GuestNavbar';

export const Home = ({ onNavigate }) => {
  const categories = [
    { name: 'Hostel Affairs', icon: Building, desc: 'Room repairs, plumbing, fans, water' },
    { name: 'Maintenance', icon: Wrench, desc: 'Electrical, carpentry, civil works' },
    { name: 'Mess & Canteen', icon: Utensils, desc: 'Food quality, hygiene, drinking water' },
    { name: 'IT & Labs', icon: Laptop, desc: 'Wi-Fi connectivity, workstations, network' },
    { name: 'Academic', icon: BookOpen, desc: 'Classroom equipment, projectors, labs' },
    { name: 'Safety & Security', icon: ShieldCheck, desc: 'Streetlights, campus security, emergency' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Lodge Complaint',
      desc: 'Submit your complaint under the right category with optional photo evidence and room location.',
      icon: FileText,
      color: '#38bdf8',
    },
    {
      num: '02',
      title: 'Live Tracking',
      desc: 'Follow the step-by-step resolution timeline as department resolvers inspect and work on the issue.',
      icon: Clock,
      color: '#a78bfa',
    },
    {
      num: '03',
      title: 'Resolution & Rating',
      desc: 'Receive confirmation once the problem is fixed and provide satisfaction feedback and star ratings.',
      icon: CheckCircle2,
      color: '#34d399',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Public Navigation with Theme Toggle */}
      <GuestNavbar activePage="home" onNavigate={onNavigate} />

      {/* Main Home Content */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '4.5rem 1.5rem 3.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(79, 70, 229, 0.12)',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
            }}
          >
            Campus Resolution Portal
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: '850px',
              color: 'var(--text-main)',
              marginBottom: '1.25rem',
            }}
          >
            Complaints Management System
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
            }}
          >
            A simple, transparent platform for campus students to report issues and for department authorities to track, inspect, and resolve them efficiently.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('login')}
              style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              Lodge a Complaint <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('login')}
              style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
            >
              Sign In to Your Account
            </button>
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '2.5rem 1.5rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              From initial complaint submission to verified resolution in three straightforward steps
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="card"
                  style={{
                    position: 'relative',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--btn-secondary-bg)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: st.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--text-dim)',
                      }}
                    >
                      {st.num}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      {st.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories Section */}
        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '3rem 1.5rem 5rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Covered Campus Departments
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Complaints are routed directly to the designated department resolvers
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {cat.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.75rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
          background: 'var(--footer-bg)',
          transition: 'background-color var(--transition-smooth)',
        }}
      >
        ResolveCampus • Complaints Management System
      </footer>
    </div>
  );
};
