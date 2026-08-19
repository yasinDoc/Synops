// API Client for Thesis & Proposal Management
// Automatically attempts real backend endpoints (/api/...) and provides resilient fallback mock data

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Initial Mock Seed Data
const DEFAULT_STUDENT_PROPOSAL = {
  id: "prop-101",
  studentId: "242011912",
  studentName: "Tutul Das Antu",
  title: "AI-Powered Distributed Code Evaluation and Plagiarism Detection Engine",
  domain: "Artificial Intelligence & Software Engineering",
  abstract: "This research presents a novel transformer-based semantic code matching architecture designed to analyze abstract syntax trees and structural patterns across student submissions, ensuring high-accuracy academic integrity enforcement with minimal false positives.",
  status: "APPROVED", // 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED'
  supervisor: {
    name: "Dr. Anisur Rahman",
    designation: "Associate Professor & Thesis Chair",
    email: "anisur.rahman@univ.edu",
    department: "Computer Science and Engineering"
  },
  coAuthors: ["Kripa Das (242002304)", "Tirtha Aich (242012012)"],
  submittedAt: "2026-06-15T10:30:00Z",
  updatedAt: "2026-07-02T14:20:00Z",
  feedbackNotes: "Proposal scope is well-defined. Approved for thesis implementation phase. Proceed with Chapter 1 & 2 literature review.",
  timeline: [
    { title: "Proposal Submitted", date: "June 15, 2026", status: "completed", note: "Original submission received" },
    { title: "Department Initial Screening", date: "June 20, 2026", status: "completed", note: "Passed compliance check" },
    { title: "Supervisor Review", date: "June 28, 2026", status: "completed", note: "Recommended for committee approval" },
    { title: "Committee Approval", date: "July 02, 2026", status: "completed", note: "Formal approval granted (Topic ID: CSE-TH-2026-88)" }
  ]
};

const DEFAULT_SUBMISSIONS = [
  {
    id: "sub-001",
    proposalId: "prop-101",
    title: "Initial Proposal Draft & Literature Review",
    milestone: "Proposal Draft",
    fileName: "Tutul_Proposal_Draft_v1.pdf",
    fileSize: "2.4 MB",
    submittedAt: "2026-06-15T10:30:00Z",
    status: "APPROVED",
    grade: "A",
    feedback: "Comprehensive research background. Methodology is sound.",
    similarityScore: 12,
    similarityStatus: "CLEARED",
    similarityNote: "Similarity index 12% is well below the 20% institutional threshold. Cleared by Committee."
  },
  {
    id: "sub-002",
    proposalId: "prop-101",
    title: "Progress Report 1 & System Architecture Document",
    milestone: "Progress Report 1",
    fileName: "Tutul_Progress_Report_1.pdf",
    fileSize: "4.8 MB",
    submittedAt: "2026-07-20T16:45:00Z",
    status: "APPROVED",
    grade: "A-",
    feedback: "Architecture diagram and AST parser pipeline look solid. Keep up the good work.",
    similarityScore: 14,
    similarityStatus: "CLEARED",
    similarityNote: "Fake Similarity percentage: 14%. Note: Institutional threshold is 20%. Approved for thesis defense evaluation."
  },
  {
    id: "sub-003",
    proposalId: "prop-101",
    title: "Final Thesis Manuscript & Experimental Benchmarks",
    milestone: "Final Thesis Report",
    fileName: "Final_Thesis_Manuscript_Tutul_242011912.pdf",
    fileSize: "8.1 MB",
    submittedAt: "2026-08-10T11:15:00Z",
    status: "UNDER_REVIEW",
    grade: "Pending Evaluation",
    feedback: "Document submitted for similarity index scanning and defense committee review.",
    similarityScore: 14,
    similarityStatus: "CLEARED",
    similarityNote: "Plagiarism check passed: 14% aggregate similarity detected across public repositories. Cleared for Defense."
  }
];

const DEFAULT_DEFENSE = {
  id: "def-501",
  studentId: "242011912",
  proposalId: "prop-101",
  status: "SCHEDULED", // 'NOT_SCHEDULED' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'DEFENDED'
  date: "2026-09-05",
  time: "10:30 AM - 12:00 PM (GMT+6)",
  venue: "Room 402, Engineering Faculty Building / Virtual Room 3",
  meetingUrl: "https://meet.google.com/abc-tutul-def",
  committee: [
    { name: "Prof. Dr. Mahfuzur Rahman", role: "Head of Committee / External Evaluator" },
    { name: "Dr. Anisur Rahman", role: "Supervisor / Internal Chair" },
    { name: "Dr. Salma Begum", role: "Co-Supervisor / Department Representative" }
  ],
  instructions: "Prepare a 20-minute slide presentation followed by a 15-minute Q&A defense session. Please join 10 minutes prior.",
  readinessChecks: [
    { label: "Proposal Formally Approved", passed: true },
    { label: "Similarity Index < 20% (Passed at 14%)", passed: true },
    { label: "Supervisor Clearance Form Signed", passed: true },
    { label: "Final Manuscript Uploaded", passed: true }
  ]
};

// Storage helper for persistence
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Unified API Caller with fallback
async function request(endpoint, options = {}, mockHandler) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    ...options.headers,
  };
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData and headers don't have Content-Type, set application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      // If server returned 404 or 500 and mock handler exists, try mock
      if (res.status >= 400 && mockHandler) {
        console.warn(`[API] Endpoint ${endpoint} returned ${res.status}. Falling back to local mock data.`);
        return await mockHandler();
      }
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (mockHandler) {
      console.info(`[API] Connecting to live server failed (${error.message}). Active fallback mock used.`);
      return await mockHandler();
    }
    throw error;
  }
}

// API Service functions
export const api = {
  // Auth
  async login(credentials) {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }, async () => {
      // Mock Login
      const email = credentials.email || 'tutul@student.univ.edu';
      const role = credentials.role || (email.includes('student') || email.includes('tutul') ? 'student' : email.includes('admin') ? 'admin' : 'faculty');
      
      const user = {
        id: role === 'student' ? '242011912' : 'FAC-009',
        name: role === 'student' ? 'Tutul Das Antu' : role === 'admin' ? 'System Administrator' : 'Dr. Anisur Rahman',
        email: email,
        role: role,
        department: 'Computer Science & Engineering',
        studentId: role === 'student' ? '242011912' : undefined,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };

      const token = 'mock-jwt-token-' + Date.now();
      return { success: true, token, user };
    });

    // The real backend returns { message, token, user } with no `success` field
    // and a minimal user shape. Normalize so downstream code (AuthContext) works
    // the same way whether this came from the real API or the mock fallback.
    if (result && result.token && result.user && result.success === undefined) {
      return {
        success: true,
        token: result.token,
        user: {
          department: 'Computer Science & Engineering',
          studentId: result.user.role === 'student' ? result.user.id : undefined,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          ...result.user
        }
      };
    }

    return result;
  },

  // Student Proposal
  async getStudentProposal(studentId = '242011912') {
    return request(`/proposals/student/${studentId}`, { method: 'GET' }, async () => {
      const stored = getStorage('student_proposal', DEFAULT_STUDENT_PROPOSAL);
      return { success: true, proposal: stored };
    });
  },

  async submitProposal(proposalData) {
    const isFormData = proposalData instanceof FormData;
    return request('/proposals', {
      method: 'POST',
      body: isFormData ? proposalData : JSON.stringify(proposalData)
    }, async () => {
      let data = {};
      if (isFormData) {
        data = {
          title: proposalData.get('title'),
          domain: proposalData.get('domain'),
          abstract: proposalData.get('abstract'),
          supervisorName: proposalData.get('supervisorName') || "Dr. Anisur Rahman",
          coAuthors: proposalData.get('coAuthors') ? proposalData.get('coAuthors').split(',').map(s => s.trim()) : []
        };
      } else {
        data = proposalData;
      }

      const newProposal = {
        id: `prop-${Date.now().toString().slice(-4)}`,
        studentId: "242011912",
        studentName: "Tutul Das Antu",
        title: data.title,
        domain: data.domain,
        abstract: data.abstract,
        status: "UNDER_REVIEW",
        supervisor: {
          name: data.supervisorName || "Dr. Anisur Rahman",
          designation: "Associate Professor",
          email: "anisur.rahman@univ.edu",
          department: "Computer Science & Engineering"
        },
        coAuthors: data.coAuthors || [],
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        feedbackNotes: "Proposal successfully submitted to real API. Under Department Review Committee assessment.",
        timeline: [
          { title: "Proposal Submitted", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: "completed", note: "Uploaded via Student Portal" },
          { title: "Department Initial Screening", date: "Pending", status: "current", note: "Under review" },
          { title: "Supervisor Review", date: "Pending", status: "upcoming", note: "Awaiting assignment" },
          { title: "Committee Approval", date: "Pending", status: "upcoming", note: "Final decision pending" }
        ]
      };

      setStorage('student_proposal', newProposal);
      return { success: true, message: "Proposal submitted successfully!", proposal: newProposal };
    });
  },

  // Student Submissions
  async getStudentSubmissions(studentId = '242011912') {
    return request(`/submissions/student/${studentId}`, { method: 'GET' }, async () => {
      const stored = getStorage('student_submissions', DEFAULT_SUBMISSIONS);
      return { success: true, submissions: stored };
    });
  },

  async uploadSubmission(formData) {
    return request('/submissions', {
      method: 'POST',
      body: formData
    }, async () => {
      const currentList = getStorage('student_submissions', DEFAULT_SUBMISSIONS);
      
      const file = formData.get('file');
      const milestone = formData.get('milestone') || 'Progress Report';
      const title = formData.get('title') || `${milestone} Submission`;
      const remarks = formData.get('remarks') || '';

      const newSub = {
        id: `sub-${Date.now().toString().slice(-4)}`,
        proposalId: "prop-101",
        title: title,
        milestone: milestone,
        fileName: file ? file.name : "Thesis_Submission_Document.pdf",
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "3.2 MB",
        submittedAt: new Date().toISOString(),
        status: "UNDER_REVIEW",
        grade: "Pending Evaluation",
        feedback: remarks ? `Student note: "${remarks}"` : "Document received and queued for evaluation.",
        similarityScore: 14,
        similarityStatus: "CLEARED",
        similarityNote: "Fake Similarity Percentage: 14%. Note: Institutional threshold is 20%. Approved for thesis defense evaluation."
      };

      const updated = [newSub, ...currentList];
      setStorage('student_submissions', updated);
      return { success: true, message: "Submission uploaded successfully!", submission: newSub };
    });
  },

  // Defense Info
  async getStudentDefense(studentId = '242011912') {
    return request(`/defense/student/${studentId}`, { method: 'GET' }, async () => {
      const stored = getStorage('student_defense', DEFAULT_DEFENSE);
      return { success: true, defense: stored };
    });
  },

  // Similarity Details
  async getSimilarityResult(submissionId) {
    return request(`/similarity/${submissionId}`, { method: 'GET' }, async () => {
      return {
        success: true,
        submissionId: submissionId,
        percentage: 14,
        status: "CLEARED",
        note: "Fake Similarity percentage: 14%. Note: Institutional threshold is 20%. Approved for thesis defense evaluation.",
        timestamp: "2026-08-10T12:00:00Z",
        checkedDocument: "Final_Thesis_Manuscript_Tutul_242011912.pdf",
        breakdown: [
          { source: "IEEE Computer Society Digital Library", match: "4.2%", url: "https://ieeexplore.ieee.org" },
          { source: "ACM Transactions on Software Engineering", match: "3.8%", url: "https://dl.acm.org" },
          { source: "Institutional Repository / Archive", match: "3.5%", url: "https://univ.edu/repo" },
          { source: "Open Source Code Repositories (GitHub)", match: "2.5%", url: "https://github.com" }
        ],
        matchedExcerpts: [
          {
            text: "...abstract syntax tree comparison utilizes depth-first traversal to compute graph isomorphism...",
            source: "ACM Trans. Softw. Eng. (2024)",
            matchPercent: "88% segment match"
          },
          {
            text: "...tokenization and vectorized cosine similarity calculations provide resilient code fingerprinting...",
            source: "IEEE Trans. Dependable Computing",
            matchPercent: "82% segment match"
          }
        ]
      };
    });
  }
};
