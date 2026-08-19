let evaluations = [
  {
    id: 1,
    defenseId: 1,
    boardMemberId: 2,
    reportMarks: 32,
    presentationMarks: 16,
    vivaMarks: 34,
    totalMarks: 82,
    feedback: 'Well-structured defense with thorough methodology.',
    createdAt: new Date().toISOString()
  }
];

export function getAllEvaluations() {
  return evaluations;
}

export function getEvaluationsByDefenseId(defenseId) {
  return evaluations.filter((evaluation) => evaluation.defenseId === Number(defenseId));
}

export function getEvaluationById(id) {
  return evaluations.find((evaluation) => evaluation.id === Number(id));
}

export function createEvaluation({
  defenseId,
  boardMemberId,
  reportMarks = 0,
  presentationMarks = 0,
  vivaMarks = 0,
  feedback = ''
}) {
  const report = Number(reportMarks) || 0;
  const presentation = Number(presentationMarks) || 0;
  const viva = Number(vivaMarks) || 0;
  const totalMarks = report + presentation + viva;

  const evaluation = {
    id: evaluations.length + 1,
    defenseId: Number(defenseId),
    boardMemberId: Number(boardMemberId),
    reportMarks: report,
    presentationMarks: presentation,
    vivaMarks: viva,
    totalMarks,
    feedback: String(feedback || '').trim(),
    createdAt: new Date().toISOString()
  };

  evaluations.push(evaluation);
  return evaluation;
}

export function updateEvaluation(id, updates = {}) {
  const index = evaluations.findIndex((e) => e.id === Number(id));
  if (index === -1) return null;

  const current = evaluations[index];
  const report = updates.reportMarks !== undefined ? Number(updates.reportMarks) : current.reportMarks;
  const presentation = updates.presentationMarks !== undefined ? Number(updates.presentationMarks) : current.presentationMarks;
  const viva = updates.vivaMarks !== undefined ? Number(updates.vivaMarks) : current.vivaMarks;
  const totalMarks = report + presentation + viva;

  const updated = {
    ...current,
    ...updates,
    reportMarks: report,
    presentationMarks: presentation,
    vivaMarks: viva,
    totalMarks,
    id: current.id,
    updatedAt: new Date().toISOString()
  };

  evaluations[index] = updated;
  return updated;
}

export function resetEvaluations() {
  evaluations = [
    {
      id: 1,
      defenseId: 1,
      boardMemberId: 2,
      reportMarks: 32,
      presentationMarks: 16,
      vivaMarks: 34,
      totalMarks: 82,
      feedback: 'Well-structured defense with thorough methodology.',
      createdAt: new Date().toISOString()
    }
  ];
}
