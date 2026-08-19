import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Users, FileCheck, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export const FacultyPlaceholder = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar />
      <div className="page-wrapper" style={{ padding: '2.5rem 2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-warning">
              <ShieldCheck size={13} /> Faculty Route Group
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Faculty & Supervisor Workspace
          </h2>
          <p style={{ color: '#cbd5e1', marginTop: '0.5rem', maxWidth: '600px' }}>
            Review assigned student proposals, evaluate milestone thesis drafts, and submit defense committee evaluations.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Faculty Review Shell Active
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0.5rem auto 1.5rem', fontSize: '0.9rem' }}>
            Role-based routing successfully navigated here for faculty credentials. You can also view the student-facing dashboard using the role switcher in the top navigation bar.
          </p>

          <div style={{ display: 'inline-flex', gap: '1rem' }}>
            <Link to="/student/dashboard" className="btn btn-primary">
              <span>Go to Student Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
