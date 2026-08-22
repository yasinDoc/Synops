import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Bell, 
  ShieldCheck, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

export const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getUserNotifications(user.id || user.studentId || 1);
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (e) {
      console.warn("Notification load error:", e);
    }
  };

  const handleMarkRead = async (notifId) => {
    await api.markNotificationAsRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsAsRead(user?.id || 1);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    <>
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
          <Link to={user?.role === 'faculty' ? '/faculty/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <option value="faculty">Faculty / Supervisor (Mahim/Anisur)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* In-App Notification Bell */}
          <button 
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'relative',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="In-App Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#ef4444',
                color: 'white',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '50%',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

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
                {user?.studentId ? `ID: ${user.studentId}` : user?.email || 'Dept. of CSE'}
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

      {/* Slide-out In-App Notification Drawer */}
      <NotificationDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
};
