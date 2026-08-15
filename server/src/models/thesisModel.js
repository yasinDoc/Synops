export const THESIS_STATUSES = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];

const theses = [
  {
    id: 1,
    title: 'AI-Based Thesis Management System',
    abstract: 'A web-based platform designed to streamline thesis proposal submission, review, similarity checking, defense scheduling, and final grading.',
    studentId: 1,
    studentName: 'Demo Student',
    supervisorId: 2,
    supervisorName: 'Demo Faculty',
    status: 'under_review',
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Distributed Ledger for Academic Document Verification',
    abstract: 'Investigating decentralized blockchain solutions for tamper-proof transcript and thesis verification across institutions.',
    studentId: 1,
    studentName: 'Demo Student',
    supervisorId: null,
    supervisorName: null,
    status: 'submitted',
    createdAt: '2026-08-15T11:30:00.000Z'
  }
];

export function getAllTheses() {
  return theses;
}

export function findThesisById(id) {
  return theses.find((item) => item.id === Number(id));
}

export function createThesis({ title, abstract, studentId = 1, studentName = 'Demo Student', supervisorId = null, supervisorName = null }) {
  const thesis = {
    id: theses.length + 1,
    title,
    abstract,
    studentId: Number(studentId),
    studentName,
    supervisorId: supervisorId ? Number(supervisorId) : null,
    supervisorName: supervisorName || null,
    status: 'submitted',
    createdAt: new Date().toISOString()
  };

  theses.push(thesis);
  return thesis;
}

export function updateThesisStatus(id, status) {
  const thesis = findThesisById(id);

  if (!thesis) {
    return null;
  }

  thesis.status = status;
  return thesis;
}

export function assignSupervisor(id, supervisorId, supervisorName = null) {
  const thesis = findThesisById(id);

  if (!thesis) {
    return null;
  }

  thesis.supervisorId = Number(supervisorId);
  if (supervisorName) {
    thesis.supervisorName = supervisorName;
  }

  return thesis;
}