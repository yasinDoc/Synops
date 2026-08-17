import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  UploadCloud, 
  ArrowLeft, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  File, 
  X,
  Sparkles,
  Layers
} from 'lucide-react';

export const SubmissionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [milestone, setMilestone] = useState('Progress Report 2');
  const [title, setTitle] = useState('Progress Report 2 - System Implementation & Testing');
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const milestoneOptions = [
    { value: 'Initial Proposal Draft', defaultTitle: 'Initial Proposal Draft & Literature Review' },
    { value: 'Progress Report 1', defaultTitle: 'Progress Report 1 - Methodology & Architecture' },
    { value: 'Progress Report 2', defaultTitle: 'Progress Report 2 - System Implementation & Testing' },
    { value: 'Pre-Defense Manuscript', defaultTitle: 'Pre-Defense Thesis Draft & Experimental Results' },
    { value: 'Final Thesis Report', defaultTitle: 'Final Thesis Manuscript & Defense Slide Deck' }
  ];

  const handleMilestoneChange = (e) => {
    const selected = e.target.value;
    setMilestone(selected);
    const found = milestoneOptions.find(m => m.value === selected);
    if (found) {
      setTitle(found.defaultTitle);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({
        type: 'error',
        text: 'Please select a document file (.pdf, .docx, .zip) to upload.'
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    setUploadProgress(20);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const payload = new FormData();
      payload.append('milestone', milestone);
      payload.append('title', title);
      payload.append('remarks', remarks);
      payload.append('studentId', user?.studentId || '242011912');
      payload.append('file', selectedFile);

      console.log("[SubmissionForm] Calling real API endpoint POST /api/submissions...");
      const res = await api.uploadSubmission(payload);

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Milestone submission uploaded successfully! Similarity check scheduled.'
        });
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Upload failed. Please try again.'
        });
      }
    } catch (err) {
      clearInterval(progressTimer);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error communicating with submission API service.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/student/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Student Dashboard</span>
        </Link>
      </div>

      <div className="card">
        {/* Form Header */}
        <div style={{
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.6rem',
              borderRadius: '10px'
            }}>
              <UploadCloud size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Upload Milestone / Thesis Manuscript
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Wired to real backend endpoint <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>POST /api/submissions</code>
              </p>
            </div>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div style={{
            background: statusMessage.type === 'success' ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--status-success-border)' : 'var(--status-danger-border)'}`,
            color: statusMessage.type === 'success' ? 'var(--status-success-text)' : 'var(--status-danger-text)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Milestone Selection */}
          <div className="form-group">
            <label className="form-label">
              Submission Milestone Phase <span className="required">*</span>
            </label>
            <select
              value={milestone}
              onChange={handleMilestoneChange}
              className="form-select"
              required
            >
              {milestoneOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Title */}
          <div className="form-group">
            <label className="form-label">
              Submission Title <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Progress Report 2 - System Implementation & Testing"
            />
          </div>

          {/* Student Remarks / Supervisor Notes */}
          <div className="form-group">
            <label className="form-label">
              Supervisor Notes & Comments (Optional)
            </label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Highlight any specific chapters or experimental results you would like supervisor feedback on..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Drag and Drop File Upload Zone */}
          <div className="form-group">
            <label className="form-label">
              Upload Manuscript File (.pdf, .docx, .zip) <span className="required">*</span>
            </label>
            <div
              className={`file-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('submission-file-input').click()}
            >
              <input
                id="submission-file-input"
                type="file"
                accept=".pdf,.docx,.zip,.tar.gz"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />

              {selectedFile ? (
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <File size={16} />
                    <span>{selectedFile.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Click to choose a different file
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Drag and drop your manuscript file here, or browse
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Accepts PDF (Preferred), DOCX, or ZIP archive up to 50MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress Bar */}
          {loading && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Uploading manuscript to API...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                  transition: 'width 0.2s ease'
                }}></div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '1.5rem'
          }}>
            <Link to="/student/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              {loading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Submit Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
