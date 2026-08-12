export const submissions = [
  {
    id: 1,
    thesisId: 1,
    filePath: '/uploads/demo-report.pdf',
    versionNo: 1,
    submittedAt: new Date().toISOString()
  }
];

export function createSubmission({ thesisId, filePath }) {
  const submission = {
    id: submissions.length + 1,
    thesisId: Number(thesisId),
    filePath,
    versionNo: submissions.filter((item) => item.thesisId === Number(thesisId)).length + 1,
    submittedAt: new Date().toISOString()
  };

  submissions.push(submission);
  return submission;
}