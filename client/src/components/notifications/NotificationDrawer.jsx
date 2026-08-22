import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  CheckCircle2, 
  MessageSquare, 
  CalendarCheck, 
  FileEdit, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer = ({ isOpen, onClose, notifications = [], onMarkRead, onMarkAllRead }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'PROPOSAL_APPROVED':
      case 'proposal_approved':
        return <CheckCircle2 size={18} style={{ color: '#10b981' }} />;
      case 'DEFENSE_SCHEDULED':
      case 'defense_scheduled':
        return <CalendarCheck size={18} style={{ color: '#8b5cf6' }} />;
      case 'REVISION_REQUESTED':
      case 'REVISION_REQUIRED':
      case 'revision_required':
        return <FileEdit size={18} style={{ color: '#f59e0b' }} />;
      case 'PROPOSAL_REJECTED':
      case 'rejected':
        return <XCircle size={18} style={{ color: '#ef4444' }} />;
      case 'COMMENT_ADDED':
      case 'comment_added':
      default:
        return <MessageSquare size={18} style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000
        }} 
      />
      <aside style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        maxWidth: '90vw',
        height: '100vh',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {notifications.length > 0 && (
              <button 
                onClick={onMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No notifications yet</p>
              <span style={{ fontSize: '0.8rem' }}>Milestone alerts and review notes will appear here.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    if (onMarkRead) onMarkRead(notif.id);
                    if (notif.thesisId) {
                      navigate(`/faculty/review/${notif.thesisId}`);
                      onClose();
                    }
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    background: notif.isRead ? 'var(--bg-main)' : 'var(--primary-light)',
                    border: `1px solid ${notif.isRead ? 'var(--border-subtle)' : 'var(--primary-glow)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {getIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {notif.title || notif.message}
                    </div>
                    {notif.title && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.3rem 0', lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                    )}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {notif.timestamp || (notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      alignSelf: 'center',
                      flexShrink: 0
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
