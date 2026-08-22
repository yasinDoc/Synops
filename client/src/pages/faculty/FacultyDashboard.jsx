import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  CalendarCheck, 
  Search, 
  FileEdit, 
  ExternalLink, 
  Download, 
  RotateCw,
  Tag,
  BookOpen
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTheses();
  }, [user]);

  const loadTheses = async () => {
    setLoading(true);
    try {
      const res = await api.getFacultyTheses(user?.id || 'FAC-009');
      if (res && res.theses) {
        setTheses(res.theses);
      }
    } catch (e) {
      console.warn("Error loading faculty theses:", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNDER_REVIEW':
      case 'under_review':
      case 'PENDING':
        return <span className="badge badge-warning"><Clock size={12} /> Pending Review</span>;
      case 'APPROVED':
      case 'approved':
      case 'PROPOSAL_APPROVED':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Proposal Approved</span>;
      case 'DEFENSE_SCHEDULED':
      case 'defense_scheduled':
        return <span className="badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}><CalendarCheck size={12} /> Defense Scheduled</span>;
      case 'REVISION_REQUIRED':
      case 'REVISION_REQUESTED':
        return <span className="badge" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' }}><FileEdit size={12} /> Revision Requested</span>;
      case 'REJECTED':
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const filteredTheses = theses.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter || 
      (filter === 'UNDER_REVIEW' && (t.status === 'PENDING' || t.status === 'under_review')) ||
      (filter === 'APPROVED' && (t.status === 'PROPOSAL_APPROVED' || t.status === 'approved'));

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      t.studentName.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      (t.matricId && t.matricId.toLowerCase().includes(q)) ||
      (t.domain && t.domain.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const totalAssigned = theses.length;
  const pendingCount = theses.filter(t => t.status === 'UNDER_REVIEW' || t.status === 'PENDING' || t.status === 'under_review').length;
  const approvedCount = theses.filter(t => t.status === 'APPROVED' || t.status === 'PROPOSAL_APPROVED' || t.status === 'approved').length;
  const defenseCount = theses.filter(t => t.status === 'DEFENSE_SCHEDULED' || t.status === 'defense_scheduled').length;

  const handleExport = () => {
    let csv = 'Student Name,Student ID,Thesis Title,Research Domain,Status,Submission Date\n';
    theses.forEach(t => {
      csv += `"${t.studentName}","${t.matricId || t.studentId}","${t.title.replace(/"/g, '""')}","${t.domain || 'CSE'}","${t.status}","${t.submittedAt || t.submissionDate}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Supervisor_Roster_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '2.2rem 2.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Supervisor Portal
            </span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Faculty Review Dashboard
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.4rem', fontSize: '0.95rem', maxWidth: '640px' }}>
            Review assigned student proposals, formulate milestone feedback, and schedule candidate thesis defenses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExport}
            className="btn btn-secondary"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)' }}
          >
            <Download size={16} />
            <span>Export Roster</span>
          </button>
          <button 
            onClick={loadTheses}
            className="btn btn-primary"
          >
            <RotateCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div 
          onClick={() => setFilter('ALL')}
          className="card" 
          style={{
            padding: '1.35rem 1.5rem',
            cursor: 'pointer',
            border: filter === 'ALL' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalAssigned}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Assigned Students
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilter('UNDER_REVIEW')}
          className="card" 
          style={{
            padding: '1.35rem 1.5rem',
            cursor: 'pointer',
            border: filter === 'UNDER_REVIEW' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fffbeb',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1.1 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Pending Reviews
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilter('APPROVED')}
          className="card" 
          style={{
            padding: '1.35rem 1.5rem',
            cursor: 'pointer',
            border: filter === 'APPROVED' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Proposals Approved
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilter('DEFENSE_SCHEDULED')}
          className="card" 
          style={{
            padding: '1.35rem 1.5rem',
            cursor: 'pointer',
            border: filter === 'DEFENSE_SCHEDULED' ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#f5f3ff',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', lineHeight: 1.1 }}>
              {defenseCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Defense Scheduled
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '460px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-input"
            placeholder="Search student name, ID, domain or thesis topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All (${totalAssigned})` },
            { id: 'UNDER_REVIEW', label: `Pending Review (${pendingCount})` },
            { id: 'APPROVED', label: `Approved (${approvedCount})` },
            { id: 'DEFENSE_SCHEDULED', label: `Defense Scheduled (${defenseCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: filter === tab.id ? 'var(--primary)' : 'var(--bg-main)',
                color: filter === tab.id ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table / Card View */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 1.5fr 1.5fr 1.2fr',
          padding: '1rem 1.5rem',
          background: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>Student Candidate</div>
          <div>Thesis Title & Domain</div>
          <div>Status</div>
          <div>Submission Date</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {filteredTheses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <BookOpen size={44} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>No theses match current filters</h4>
            <p style={{ fontSize: '0.85rem', margin: '0.3rem 0 1rem' }}>Try adjusting your search keywords or status tabs above.</p>
            <button onClick={() => { setFilter('ALL'); setSearchQuery(''); }} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {filteredTheses.map((thesis) => (
              <div 
                key={thesis.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 3fr 1.5fr 1.5fr 1.2fr',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.15s ease'
                }}
                className="hover-row"
              >
                {/* Candidate Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    {thesis.studentName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {thesis.studentName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {thesis.matricId || thesis.studentId || 'ID: 242011912'}
                    </div>
                  </div>
                </div>

                {/* Title & Domain */}
                <div style={{ paddingRight: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.2rem' }}>
                    {thesis.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Tag size={12} style={{ color: 'var(--primary)' }} />
                    <span>{thesis.domain || 'Computer Science & AI'}</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  {getStatusBadge(thesis.status)}
                </div>

                {/* Date */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div>{thesis.submittedAt ? new Date(thesis.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (thesis.submissionDate || 'Aug 19, 2026')}</div>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Updated {thesis.updatedAt ? 'Recently' : 'Aug 21'}</small>
                </div>

                {/* Action */}
                <div style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => navigate(`/faculty/review/${thesis.id}`)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Open Review</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
