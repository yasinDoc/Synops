import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  FileText, 
  Upload, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Paperclip,
  Sparkles,
  Layers,
  Users
} from 'lucide-react';

export const ProposalForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    domain: 'Artificial Intelligence & Machine Learning',
    abstract: '',
    problemStatement: '',
    supervisorName: 'Dr. Anisur Rahman',
    coAuthors: '',
    expectedOutcomes: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const domainOptions = [
    'Artificial Intelligence & Machine Learning',
    'Data Science & Big Data Analytics',
    'Cyber Security & Cryptography',
    'Software Engineering & Cloud Architecture',
    'Internet of Things (IoT) & Embedded Systems',
    'Natural Language Processing & Computer Vision',
    'Robotics & Autonomous Systems'
  ];

  const supervisorOptions = [
    { name: 'Dr. Anisur Rahman', role: 'Associate Professor (Thesis Chair)' },
    { name: 'Prof. Dr. Mahfuzur Rahman', role: 'Professor (AI & Data Science)' },
    { name: 'Dr. Salma Begum', role: 'Assistant Professor (Cyber Security)' },
    { name: 'Dr. Tariqul Islam', role: 'Associate Professor (Software Eng)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // Build FormData payload to call the real API endpoint
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('domain', formData.domain);
      payload.append('abstract', formData.abstract);
      payload.append('problemStatement', formData.problemStatement);
      payload.append('supervisorName', formData.supervisorName);
      payload.append('coAuthors', formData.coAuthors);
      payload.append('expectedOutcomes', formData.expectedOutcomes);
      payload.append('studentId', user?.studentId || '242011912');
      if (selectedFile) {
        payload.append('file', selectedFile);
      }

      console.log("[ProposalForm] Calling real API endpoint POST /api/proposals...");
      const res = await api.submitProposal(payload);

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Thesis proposal successfully submitted! Routed to Department Review Committee.'
        });
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Submission failed. Please check form fields.'
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error communicating with proposal API service.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
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
              <FileText size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Submit Research / Thesis Proposal
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Wired to real backend endpoint <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>POST /api/proposals</code>
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
            {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Research Title */}
          <div className="form-group">
            <label className="form-label">
              Thesis / Project Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              className="form-input"
              placeholder="e.g. AI-Powered Distributed Code Evaluation and Semantic Plagiarism Detection"
              value={formData.title}
              onChange={handleInputChange}
            />
            <div className="form-hint">
              Provide a clear, descriptive title that encapsulates your thesis scope and technology stack.
            </div>
          </div>

          {/* Research Domain & Preferred Supervisor */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                Research Domain / Track <span className="required">*</span>
              </label>
              <select
                name="domain"
                required
                className="form-select"
                value={formData.domain}
                onChange={handleInputChange}
              >
                {domainOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Preferred Supervisor <span className="required">*</span>
              </label>
              <select
                name="supervisorName"
                required
                className="form-select"
                value={formData.supervisorName}
                onChange={handleInputChange}
              >
                {supervisorOptions.map((sup) => (
                  <option key={sup.name} value={sup.name}>
                    {sup.name} — {sup.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Co-Authors / Research Partners */}
          <div className="form-group">
            <label className="form-label">
              Co-Authors / Research Partners (Optional)
            </label>
            <input
              type="text"
              name="coAuthors"
              className="form-input"
              placeholder="e.g. Kripa Das (242002304), Tirtha Aich (242012012)"
              value={formData.coAuthors}
              onChange={handleInputChange}
            />
            <div className="form-hint">
              Separate team member names and student IDs with commas.
            </div>
          </div>

          {/* Abstract / Summary */}
          <div className="form-group">
            <label className="form-label">
              Abstract & Executive Summary <span className="required">*</span>
            </label>
            <textarea
              name="abstract"
              required
              rows={4}
              className="form-textarea"
              placeholder="Summarize the core research objective, theoretical foundations, and proposed implementation framework..."
              value={formData.abstract}
              onChange={handleInputChange}
            />
          </div>

          {/* Problem Statement */}
          <div className="form-group">
            <label className="form-label">
              Problem Statement & Research Objectives
            </label>
            <textarea
              name="problemStatement"
              rows={3}
              className="form-textarea"
              placeholder="Detail the specific gap or challenge your thesis addresses and the primary goals to be accomplished..."
              value={formData.problemStatement}
              onChange={handleInputChange}
            />
          </div>

          {/* File Attachment Upload */}
          <div className="form-group">
            <label className="form-label">
              Proposal Document Attachment (.pdf, .docx)
            </label>
            <div 
              className="file-dropzone"
              onClick={() => document.getElementById('proposal-file-input').click()}
            >
              <input
                id="proposal-file-input"
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
              {selectedFile ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    Click or drag proposal document to attach
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Supported formats: PDF, DOCX (Max 25MB)
                  </div>
                </div>
              )}
            </div>
          </div>

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
              disabled={loading}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              {loading ? (
                <span>Submitting Proposal...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit to Committee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
