import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Bell, 
  ShieldCheck, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return <span className="badge badge-info"><ShieldCheck size={12} /> Student Portal</span>;
      case 'faculty':
        return <span className="badge badge-warning"><ShieldCheck size={12} /> Faculty Reviewer</span>;
      case 'admin':
        return <span className="badge badge-danger"><ShieldCheck size={12} /> Administrator</span>;
      default:
        return <span className="badge badge-info">{role}</span>;
    }
  };

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/student/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: 'white',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px var(--primary-glow)'
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              AcademicFlow
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Thesis & Defense Management System
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Quick Role Switcher for Pairing & Review */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-main)',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem'
        }}>
          <ArrowRightLeft size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Role:</span>
          <select 
            value={user?.role || 'student'} 
            onChange={(e) => {
              const r = e.target.value;
              switchRole(r);
              if (r === 'student') navigate('/student/dashboard');
              if (r === 'faculty') navigate('/faculty/dashboard');
              if (r === 'admin') navigate('/admin/dashboard');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '0.8rem'
            }}
          >
            <option value="student">Student (Tutul)</option>
            <option value="faculty">Faculty / Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* User Info Capsule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '2px solid white',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'TD'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user?.name || 'Tutul Das Antu'}
              </span>
              {getRoleBadge(user?.role)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.studentId ? `ID: ${user.studentId}` : user?.email}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          title="Sign out"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-danger-text)' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
