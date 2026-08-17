import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SimilarityModal } from '../../components/student/SimilarityModal';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  PlusCircle, 
  Download, 
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [defense, setDefense] = useState(null);
  const [selectedSubmissionForSimilarity, setSelectedSubmissionForSimilarity] = useState(null);
  const [isSimilarityOpen, setIsSimilarityOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentId = user?.studentId || '242011912';
      const [propRes, subsRes, defRes] = await Promise.all([
        api.getStudentProposal(studentId),
        api.getStudentSubmissions(studentId),
        api.getStudentDefense(studentId)
      ]);

      if (propRes.success) setProposal(propRes.proposal);
      if (subsRes.success) setSubmissions(subsRes.submissions);
      if (defRes.success) setDefense(defRes.defense);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleOpenSimilarity = (sub) => {
    setSelectedSubmissionForSimilarity(sub);
    setIsSimilarityOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Approved</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-info"><Clock size={12} /> Under Review</span>;
      case 'REVISION_REQUIRED':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> Revision Needed</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Rejected</span>;
      case 'SCHEDULED':
        return <span className="badge badge-success"><Calendar size={12} /> Scheduled</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              ID: {user?.studentId || '242011912'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>Dept. of Computer Science & Engineering</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name || 'Tutul Das Antu'}
          </h2>
          <p style={{ color: '#e0e7ff', marginTop: '0.5rem', fontSize: '0.9rem', maxWidth: '650px' }}>
            Track your research proposal status, manage milestone manuscript uploads, check real-time plagiarism clearance, and review your defense schedule.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={fetchData} 
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/student/submissions/new" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
            <UploadCloud size={16} />
            <span>Upload Manuscript</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Highlight Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Metric 1: Proposal Status */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Proposal Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {proposal?.status || 'APPROVED'}
              </span>
              {getStatusBadge(proposal?.status)}
            </div>
          </div>
        </div>

        {/* Metric 2: Similarity Index */}
        <div 
          className="card" 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: '1.5px solid #c7d2fe' }}
          onClick={() => handleOpenSimilarity(submissions[0] || { id: 'sub-003', similarityScore: 14 })}
          title="Click to view full similarity scan breakdown"
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Similarity Index (Fake %)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
                14% (Cleared)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                View Report &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Defense Status */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fffbeb',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Defense Schedule
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {defense?.date ? `${defense.date} (${defense.status})` : 'Scheduled'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Proposal Details & Defense Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Section 1: Proposal Status Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="var(--primary)" />
              <span>Thesis Proposal Information</span>
            </div>
            <Link to="/student/proposal/new" className="btn btn-outline-primary btn-sm">
              <PlusCircle size={14} />
              <span>New Proposal</span>
            </Link>
          </div>

          {proposal ? (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  background: 'var(--primary-light)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {proposal.domain}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', lineHeight: 1.35 }}>
                  {proposal.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  {proposal.abstract}
                </p>
              </div>

              {/* Supervisor & Co-authors */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    SUPERVISOR / CHAIR
                  </div>
                  <span className="badge badge-success">Assigned</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#e0e7ff',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    AR
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {proposal.supervisor?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {proposal.supervisor?.designation} · {proposal.supervisor?.email}
                    </div>
                  </div>
                </div>

                {proposal.coAuthors && proposal.coAuthors.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Co-Researchers: {proposal.coAuthors.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Proposal Approval Timeline */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Approval Milestones
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(proposal.timeline || []).map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.825rem' }}>
                      <CheckCircle2 size={16} color={step.status === 'completed' ? 'var(--status-success)' : 'var(--text-muted)'} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: step.status === 'completed' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {step.title}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{step.date}</span>
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{step.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No proposal submitted yet.</p>
              <Link to="/student/proposal/new" className="btn btn-primary">
                Submit Research Proposal
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Defense Information Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Calendar size={18} color="#d97706" />
              <span>Defense Schedule & Committee</span>
            </div>
            {getStatusBadge(defense?.status || 'SCHEDULED')}
          </div>

          {defense ? (
            <div>
              {/* Defense Schedule Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Defense Date</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>{defense.date}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Defense Time</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#78350f' }}>{defense.time}</div>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Venue / Virtual Meeting</span>
                  <div style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '0.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{defense.venue}</span>
                    {defense.meetingUrl && (
                      <a href={defense.meetingUrl} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: '#d97706', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        Join Meet <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Committee Members */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={15} />
                  <span>Evaluation Committee</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(defense.committee || []).map((member, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.825rem'
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defense Clearance Checklist */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Readiness Criteria
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {(defense.readinessChecks || []).map((chk, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      color: chk.passed ? 'var(--status-success-text)' : 'var(--text-muted)',
                      background: chk.passed ? 'var(--status-success-bg)' : '#f8fafc',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${chk.passed ? 'var(--status-success-border)' : 'var(--border-subtle)'}`
                    }}>
                      <CheckCircle2 size={14} />
                      <span style={{ fontWeight: 600 }}>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
              Defense schedule pending proposal and manuscript clearance.
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Submissions List & Milestone History */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UploadCloud size={18} color="var(--primary)" />
            <span>Milestone Manuscript Submissions</span>
          </div>
          <Link to="/student/submissions/new" className="btn btn-primary btn-sm">
            <UploadCloud size={14} />
            <span>Upload New Milestone Document</span>
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Milestone & Title</th>
                  <th>File Upload</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Grade / Verdict</th>
                  <th>Similarity Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {sub.milestone}
                        </span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          {sub.title}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                        <FileText size={15} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>{sub.fileName}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({sub.fileSize})</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      {getStatusBadge(sub.status)}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: sub.grade.includes('A') ? 'var(--status-success-text)' : 'var(--text-secondary)'
                      }}>
                        {sub.grade}
                      </span>
                    </td>
                    <td>
                      {/* Similarity Result with Fake % and trigger */}
                      <button
                        onClick={() => handleOpenSimilarity(sub)}
                        className="btn btn-sm"
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#065f46',
                          padding: '0.25rem 0.6rem',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        title="View similarity analysis report"
                      >
                        <ShieldCheck size={13} />
                        <span>{sub.similarityScore || 14}% (Cleared)</span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => alert(`Downloading: ${sub.fileName}`)}
                          className="btn btn-secondary btn-sm"
                          title="Download uploaded document"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenSimilarity(sub)}
                          className="btn btn-outline-primary btn-sm"
                          title="View similarity score & feedback note"
                        >
                          View Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>No submissions found</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              Upload your initial proposal draft or progress report to get started.
            </p>
            <Link to="/student/submissions/new" className="btn btn-primary">
              Upload Manuscript
            </Link>
          </div>
        )}
      </div>

      {/* Similarity Report Modal */}
      <SimilarityModal
        isOpen={isSimilarityOpen}
        onClose={() => setIsSimilarityOpen(false)}
        submission={selectedSubmissionForSimilarity}
      />
    </div>
  );
};
