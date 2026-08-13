export const THESIS_STATUSES = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];

const theses = [
  {
    id: 1,
    title: 'AI-based Thesis Management System',
    abstract: 'Demo abstract for starter flow.',
    studentName: 'Demo Student',
    supervisorName: 'Demo Supervisor',
    status: 'draft'
  }
];

export function getAllTheses() {
  return theses;
}

export function findThesisById(id) {
  return theses.find((item) => item.id === Number(id));
}

export function createThesis({ title, abstract, studentName, supervisorName }) {
  const thesis = {
    id: theses.length + 1,
    title,
    abstract,
    studentName,
    supervisorName: supervisorName || null,
    status: 'draft'
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