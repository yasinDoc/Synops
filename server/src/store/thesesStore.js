export const theses = [
  {
    id: 1,
    title: 'AI-based Thesis Management System',
    studentName: 'Demo Student',
    supervisorName: 'Demo Supervisor',
    status: 'draft'
  }
];

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
