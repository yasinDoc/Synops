import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    {
      to: '/student/dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: 'Main'
    },
    {
      to: '/student/proposal/new',
      label: 'Submit Proposal',
      icon: FileText,
      badge: null
    },
    {
      to: '/student/submissions/new',
      label: 'Upload Submission',
      icon: UploadCloud,
      badge: 'Files'
    }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)'
    }}>
      {/* Portal Identification */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.2)',
          color: '#818cf8',
          padding: '0.5rem',
          borderRadius: '8px'
        }}>
          <BookOpen size={18} />
        </div>
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#cbd5e1', margin: 0 }}>
            Student Workspace
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dept. of CSE</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                transition: 'all 0.15s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontWeight: 600
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Status Info widget */}
      <div style={{
        marginTop: 'auto',
        padding: '1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          background: 'rgba(79, 70, 229, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '10px',
          padding: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e0e7ff' }}>Live API Status</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Connected to real backend endpoints with fallback data bridge.
          </p>
        </div>
      </div>
    </aside>
  );
};
