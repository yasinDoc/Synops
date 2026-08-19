import {
  getAllEvaluations,
  getEvaluationsByDefenseId,
  getEvaluationById,
  createEvaluation,
  updateEvaluation
} from '../models/evaluationModel.js';

export function listEvaluations(req, res) {
  const evaluations = getAllEvaluations();
  return res.json({ items: evaluations });
}

export function getDefenseEvaluations(req, res) {
  const defenseId = Number(req.params.defenseId);
  const items = getEvaluationsByDefenseId(defenseId);
  return res.json({ items });
}

export function getSingleEvaluation(req, res) {
  const { id } = req.params;
  const evaluation = getEvaluationById(id);

  if (!evaluation) {
    return res.status(404).json({ message: 'Evaluation not found' });
  }

  return res.json({ evaluation });
}

export function submitEvaluation(req, res) {
  const { defenseId, boardMemberId, reportMarks, presentationMarks, vivaMarks, feedback } = req.body;

  if (
    defenseId === undefined ||
    boardMemberId === undefined ||
    reportMarks === undefined ||
    presentationMarks === undefined ||
    vivaMarks === undefined
  ) {
    return res.status(400).json({ message: 'all evaluation marks are required (reportMarks, presentationMarks, vivaMarks)' });
  }

  const evaluation = createEvaluation({
    defenseId,
    boardMemberId,
    reportMarks,
    presentationMarks,
    vivaMarks,
    feedback
  });

  return res.status(201).json({
    message: 'Evaluation saved',
    evaluation
  });
}

export function editEvaluation(req, res) {
  const { id } = req.params;
  const updated = updateEvaluation(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: 'Evaluation not found' });
  }

  return res.json({
    message: 'Evaluation updated',
    evaluation: updated
  });
}
