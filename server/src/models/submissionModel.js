const submissions = [
  {
    id: 1,
    thesisId: 1,
    filePath: '/uploads/demo-report.pdf',
    versionNo: 1,
    submittedAt: new Date().toISOString()
  }
];

export function getAllSubmissions() {
  return submissions;
}

export function findSubmissionById(id) {
  return submissions.find((item) => item.id === Number(id));
}

export function createSubmission({ thesisId, filePath }) {
  const normalizedThesisId = Number(thesisId);
  const submission = {
    id: submissions.length + 1,
    thesisId: normalizedThesisId,
    filePath,
    versionNo: submissions.filter((item) => item.thesisId === normalizedThesisId).length + 1,
    submittedAt: new Date().toISOString()
  };

  submissions.push(submission);
  return submission;
}