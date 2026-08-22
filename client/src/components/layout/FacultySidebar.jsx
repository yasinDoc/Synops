import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  CalendarCheck, 
  Bell,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

export const FacultySidebar = () => {
  const navItems = [
    {
      to: '/faculty/dashboard',
      label: 'Supervisor Roster',
      icon: LayoutDashboard,
      badge: 'Main'
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
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          padding: '0.5rem',
          borderRadius: '8px'
        }}>
          <ShieldCheck size={18} />
        </div>
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#cbd5e1', margin: 0 }}>
            Faculty Workspace
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Supervisor & Reviewer</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
          Navigation
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
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Supervisor Summary Widget */}
      <div style={{
        marginTop: 'auto',
        padding: '1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            AR
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Dr. Anisur Rahman</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dept. Review Chair</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
