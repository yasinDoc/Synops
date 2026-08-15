import { Router } from 'express';

const evaluations = [
  {
    id: 1,
    defenseId: 1,
    boardMemberId: 3,
    reportMarks: 32,
    presentationMarks: 16,
    vivaMarks: 34,
    totalMarks: 82
  }
];

const router = Router();

router.get('/defense/:defenseId', (req, res) => {
  const defenseId = Number(req.params.defenseId);
  res.json({ items: evaluations.filter((evaluation) => evaluation.defenseId === defenseId) });
});

router.post('/', (req, res) => {
  const { defenseId, boardMemberId, reportMarks, presentationMarks, vivaMarks } = req.body;

  if (
    defenseId === undefined ||
    boardMemberId === undefined ||
    reportMarks === undefined ||
    presentationMarks === undefined ||
    vivaMarks === undefined
  ) {
    return res.status(400).json({ message: 'all evaluation marks are required' });
  }

  const totalMarks = Number(reportMarks) + Number(presentationMarks) + Number(vivaMarks);

  const evaluation = {
    id: evaluations.length + 1,
    defenseId: Number(defenseId),
    boardMemberId: Number(boardMemberId),
    reportMarks: Number(reportMarks),
    presentationMarks: Number(presentationMarks),
    vivaMarks: Number(vivaMarks),
    totalMarks
  };

  evaluations.push(evaluation);

  return res.status(201).json({ message: 'Evaluation saved', evaluation });
});

export default router;