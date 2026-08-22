import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  CalendarPlus, 
  FileEdit, 
  XCircle, 
  User, 
  FileText, 
  Paperclip, 
  Download, 
  MessagesSquare, 
  Send, 
  CalendarCheck,
  Tag,
  Clock,
  Info,
  Check
} from 'lucide-react';

export const FacultyReviewScreen = () => {
  const { thesisId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'approve' | 'schedule' | 'revisions' | 'reject'
  const [modalInput, setModalInput] = useState('');
  const [scheduleData, setScheduleData] = useState({
    date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    venue: 'Auditorium Hall B & Zoom Hybrid Room #302',
    committee: 'Prof. Mahim Chowdhury (Chair), Dr. Evelyn Reed, Dr. Samuel Kim'
  });

  // Comment composer state
  const [commentText, setCommentText] = useState('');
  const [commentTag, setCommentTag] = useState('General Feedback');

  useEffect(() => {
    loadThesisAndComments();
  }, [thesisId]);

  const loadThesisAndComments = async () => {
    setLoading(true);
    try {
      const res = await api.getThesisById(thesisId);
      if (res && res.thesis) {
        setThesis(res.thesis);
      }
      const commRes = await api.getThesisComments(thesisId);
      if (commRes && commRes.comments) {
        setComments(commRes.comments);
      }
    } catch (e) {
      console.warn("Failed to load thesis review:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComm = await api.postComment(thesisId, {
        authorId: user?.id || 'FAC-009',
        authorName: user?.name || 'Dr. Anisur Rahman',
        authorRole: user?.role === 'student' ? 'STUDENT' : 'SUPERVISOR',
        content: commentText.trim(),
        tag: commentTag
      });

      setComments(prev => [...prev, newComm.comment]);
      setCommentText('');
    } catch (e) {
      alert("Failed to post comment: " + e.message);
    }
  };

  const handleDecision = async (decisionType) => {
    try {
      if (decisionType === 'APPROVED') {
        await api.updateThesisDecision(thesisId, 'APPROVED', { note: modalInput });
      } else if (decisionType === 'DEFENSE_SCHEDULED') {
        await api.updateThesisDecision(thesisId, 'DEFENSE_SCHEDULED', { defense: scheduleData });
      } else if (decisionType === 'REVISION_REQUIRED') {
        if (!modalInput.trim()) {
          alert('Please enter revision instructions.');
          return;
        }
        await api.updateThesisDecision(thesisId, 'REVISION_REQUIRED', { note: modalInput });
      } else if (decisionType === 'REJECTED') {
        if (!modalInput.trim()) {
          alert('Please provide reason for rejection.');
          return;
        }
        await api.updateThesisDecision(thesisId, 'REJECTED', { reason: modalInput });
      }

      setActiveModal(null);
      setModalInput('');
      loadThesisAndComments();
    } catch (e) {
      alert("Failed to update status: " + e.message);
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

  if (loading || !thesis) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Loading thesis review workspace...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Sticky Top Bar & Decision Actions */}
      <div className="card" style={{
        padding: '1.25rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        position: 'sticky',
        top: '72px',
        zIndex: 50,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/faculty/dashboard')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              {getStatusBadge(thesis.status)}
              <span className="badge badge-info">{thesis.domain || 'CSE'}</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {thesis.title}
            </h2>
          </div>
        </div>

        {/* Supervisor Action Decision Group */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setActiveModal('approve'); setModalInput(''); }}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderColor: '#059669' }}
          >
            <CheckCircle2 size={15} />
            <span>Approve Proposal</span>
          </button>

          <button 
            onClick={() => setActiveModal('schedule')}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', borderColor: '#7c3aed' }}
          >
            <CalendarPlus size={15} />
            <span>Schedule Defense</span>
          </button>

          <button 
            onClick={() => { setActiveModal('revisions'); setModalInput(''); }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
          >
            <FileEdit size={15} />
            <span>Request Revisions</span>
          </button>

          <button 
            onClick={() => { setActiveModal('reject'); setModalInput(''); }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }}
          >
            <XCircle size={15} />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Two-Column Review Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Thesis Content, Objectives, Documents, Defense Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Candidate Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              flexShrink: 0
            }}>
              {thesis.studentName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {thesis.studentName}
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: 'var(--bg-main)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  {thesis.matricId || thesis.studentId || 'ID: 242011912'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.4rem' }}>
                {thesis.studentEmail || `${thesis.studentName.toLowerCase().replace(/\s+/g, '.')}@univ.edu`}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span><strong>Supervisor:</strong> {thesis.supervisorName || 'Dr. Anisur Rahman'}</span>
                <span><strong>Updated:</strong> {thesis.updatedAt || 'Recent'}</span>
              </div>
            </div>
          </div>

          {/* Defense Banner (if scheduled) */}
          {thesis.defenseDetails && (
            <div style={{
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              border: '1px solid #ddd6fe',
              borderRadius: 'var(--radius-md)',
              padding: '1.35rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#8b5cf6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CalendarCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#5b21b6', margin: '0 0 0.4rem 0' }}>
                  Oral Thesis Defense Scheduled
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#6d28d9', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div><strong>Date & Time:</strong> {thesis.defenseDetails.dateFormatted || `${thesis.defenseDetails.date} at ${thesis.defenseDetails.time}`}</div>
                  <div><strong>Venue / Location:</strong> {thesis.defenseDetails.venue}</div>
                  <div><strong>Committee Members:</strong> {thesis.defenseDetails.committee}</div>
                </div>
              </div>
            </div>
          )}

          {/* Abstract & Scope */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Proposal Abstract & Research Scope
              </h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
              {thesis.abstract}
            </p>

            {thesis.objectives && thesis.objectives.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                  Key Research Objectives
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {thesis.objectives.map((obj, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Documents & Drafts */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Paperclip size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Submitted Documents & Drafts
                </h3>
              </div>
              <span className="badge badge-info">{thesis.documents ? thesis.documents.length : 1} Files</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(thesis.documents || [
                { name: `${thesis.studentName}_Proposal_Draft.pdf`, size: '2.4 MB', date: 'Aug 19, 2026' }
              ]).map((doc, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: '#ef4444' }}><FileText size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.date}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading draft file: ${doc.name}`)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 1-Level Comment Thread UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessagesSquare size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Supervisor & Student Feedback
                </h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '9999px' }}>
                1-Level Thread
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
              Direct single-level comment thread between supervisor and student candidate. Posting automatically notifies the recipient.
            </p>

            {/* Comment Stream */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '460px',
              overflowY: 'auto',
              paddingRight: '0.25rem',
              marginBottom: '1.5rem'
            }}>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No review comments yet. Start the conversation with the candidate below.
                </div>
              ) : (
                comments.map((c) => {
                  const isSupervisor = c.authorRole === 'SUPERVISOR' || c.authorId === 'FAC-009' || (c.authorName && c.authorName.includes('Dr.'));
                  return (
                    <div 
                      key={c.id}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isSupervisor ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}>
                        {c.authorName ? c.authorName.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                      </div>

                      <div style={{
                        flex: 1,
                        background: isSupervisor ? '#fffbeb' : 'var(--bg-main)',
                        border: `1px solid ${isSupervisor ? '#fde68a' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {c.authorName}
                            </span>
                            <span className={`badge ${isSupervisor ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {isSupervisor ? 'Supervisor' : 'Candidate'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {c.timestamp || (c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                          </span>
                        </div>

                        {c.tag && (
                          <div style={{ marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '0.1rem 0.4rem', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                              {c.tag}
                            </span>
                          </div>
                        )}

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {c.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Composer */}
            <form onSubmit={handlePostComment} style={{ marginTop: 'auto', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Posting as: <strong style={{ color: 'var(--primary)' }}>{user?.name || 'Dr. Anisur Rahman'} ({user?.role === 'student' ? 'Student' : 'Supervisor'})</strong>
              </div>

              <textarea 
                rows="3"
                className="form-input"
                placeholder="Write your review comments, milestone feedback, or suggestions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category:</span>
                  <select 
                    value={commentTag}
                    onChange={(e) => setCommentTag(e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'white' }}
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Methodology Revision">Methodology Revision</option>
                    <option value="Literature Review">Literature Review</option>
                    <option value="Defense Prep">Defense Prep</option>
                    <option value="Approval Remark">Approval Remark</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Send size={13} />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decision Modals */}
      
      {/* Modal 1: Approve */}
      {activeModal === 'approve' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', marginBottom: '1rem' }}>
              <CheckCircle2 size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Approve Thesis Proposal</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              You are approving the proposal for <strong>{thesis.studentName}</strong>. This clears the candidate for the research implementation phase.
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Supervisor Approval Remark (Optional):
              </label>
              <textarea 
                rows="3"
                className="form-input"
                placeholder="Scope is approved. Proceed with dataset synthesis and preliminary benchmarks."
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleDecision('APPROVED')} className="btn btn-primary btn-sm" style={{ background: '#10b981', borderColor: '#10b981' }}>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Schedule Defense */}
      {activeModal === 'schedule' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8b5cf6', marginBottom: '1rem' }}>
              <CalendarPlus size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Schedule Thesis Oral Defense</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Defense Date:
                </label>
                <input 
                  type="date"
                  className="form-input"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Time Slot:
                </label>
                <input 
                  type="text"
                  className="form-input"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Venue / Room / Link:
              </label>
              <input 
                type="text"
                className="form-input"
                value={scheduleData.venue}
                onChange={(e) => setScheduleData({ ...scheduleData, venue: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Committee Members:
              </label>
              <input 
                type="text"
                className="form-input"
                value={scheduleData.committee}
                onChange={(e) => setScheduleData({ ...scheduleData, committee: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleDecision('DEFENSE_SCHEDULED')} className="btn btn-primary btn-sm" style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }}>
                Confirm Defense Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Request Revisions */}
      {activeModal === 'revisions' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', marginBottom: '1rem' }}>
              <FileEdit size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Request Thesis Revisions</h3>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Required Modifications / Checklist:
              </label>
              <textarea 
                rows="4"
                className="form-input"
                placeholder="Please expand section 2 with recent 2025-2026 baselines and clarify the Byzantine node threshold calculations in methodology."
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleDecision('REVISION_REQUIRED')} className="btn btn-primary btn-sm" style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>
                Send Revision Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Reject */}
      {activeModal === 'reject' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ef4444', marginBottom: '1rem' }}>
              <XCircle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Reject Thesis Proposal</h3>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Rejection Rationale & Department Feedback:
              </label>
              <textarea 
                rows="4"
                className="form-input"
                placeholder="The proposed research overlaps heavily with an existing departmental project and does not offer sufficient novel contributions."
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleDecision('REJECTED')} className="btn btn-secondary btn-sm" style={{ background: '#ef4444', color: 'white', borderColor: '#ef4444' }}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
