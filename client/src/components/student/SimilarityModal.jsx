import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  Download
} from 'lucide-react';
import { api } from '../../services/api';

export const SimilarityModal = ({ isOpen, onClose, submission }) => {
  const [loading, setLoading] = useState(false);
  const [similarityData, setSimilarityData] = useState(null);

  useEffect(() => {
    if (isOpen && submission) {
      setLoading(true);
      api.getSimilarityResult(submission.id)
        .then((res) => {
          setSimilarityData(res);
        })
        .catch((err) => {
          console.error("Failed to load similarity:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, submission]);

  if (!isOpen || !submission) return null;

  const score = similarityData?.percentage ?? (submission.similarityScore || 14);
  const isSafe = score <= 20;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: isSafe ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
              color: isSafe ? 'var(--status-success)' : 'var(--status-danger)',
              padding: '0.5rem',
              borderRadius: '8px'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Academic Integrity & Plagiarism Report
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Document: {submission.fileName || submission.title}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Retrieving similarity scan results...</p>
            </div>
          ) : (
            <div>
              {/* Score Display Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Circular Score Badge */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: isSafe ? '#ecfdf5' : '#fef2f2',
                    border: `3px solid ${isSafe ? '#10b981' : '#ef4444'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isSafe ? '#065f46' : '#991b1b', lineHeight: 1 }}>
                      {score}%
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isSafe ? '#059669' : '#dc2626', textTransform: 'uppercase' }}>
                      Index
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge ${isSafe ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}>
                        {isSafe ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                        {isSafe ? 'Cleared (Safe Threshold)' : 'Threshold Exceeded'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Institutional maximum allowed limit: <strong>20%</strong>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Downloading official similarity clearance report for: ${submission.fileName}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Requirement Note Prompt Box */}
              <div style={{
                backgroundColor: 'var(--status-info-bg)',
                border: '1px solid var(--status-info-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-info-text)', margin: '0 0 0.25rem 0' }}>
                    Evaluation Note & Committee Remark
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {similarityData?.note || submission.similarityNote || "Fake Similarity percentage: 14%. Note: Institutional threshold is 20%. Approved for thesis defense evaluation."}
                  </p>
                </div>
              </div>

              {/* Matched Sources Breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} />
                  <span>Matching Source Repositories</span>
                </h4>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {(similarityData?.breakdown || [
                    { source: "IEEE Computer Society Digital Library", match: "4.2%", url: "https://ieeexplore.ieee.org" },
                    { source: "ACM Transactions on Software Engineering", match: "3.8%", url: "https://dl.acm.org" },
                    { source: "Institutional Repository Archive", match: "3.5%", url: "https://univ.edu/repo" },
                    { source: "Open Source Repositories (GitHub)", match: "2.5%", url: "https://github.com" }
                  ]).map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: idx % 2 === 0 ? '#fff' : '#f8fafc',
                        borderBottom: idx === 3 ? 'none' : '1px solid var(--border-subtle)',
                        fontSize: '0.825rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>{idx + 1}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.source}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--text-secondary)',
                          background: '#e2e8f0',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {item.match}
                        </span>
                        <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Excerpt Matches */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Segment Match Highlights
                </h4>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  <div style={{ color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline' }}>
                    "...abstract syntax tree comparison utilizes depth-first traversal to compute graph isomorphism..."
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-sans)' }}>
                    Matched Source: ACM Trans. Softw. Eng. (2024) · Match type: Structural phrasing
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#f8fafc',
          borderBottomLeftRadius: 'var(--radius-lg)',
          borderBottomRightRadius: 'var(--radius-lg)'
        }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
