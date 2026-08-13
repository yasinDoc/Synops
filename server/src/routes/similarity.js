import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const similarityResults = [
  {
    submissionId: 1,
    similarityPct: 18,
    matchedNote: 'Matched paragraph: literature review on thesis workflow systems.'
  }
];

const router = Router();

router.use(requireAuth);

router.post('/check', requireRole('student', 'faculty', 'admin'), (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ message: 'submissionId is required' });
  }

  const similarityPct = 12 + (Number(submissionId) % 4) * 6;
  const result = {
    submissionId: Number(submissionId),
    similarityPct,
    matchedNote: 'Matched paragraph: project summary and related work section.'
  };

  const existingIndex = similarityResults.findIndex((item) => item.submissionId === Number(submissionId));

  if (existingIndex >= 0) {
    similarityResults[existingIndex] = result;
  } else {
    similarityResults.push(result);
  }

  return res.status(201).json({ message: 'Fake similarity check completed', result });
});

router.get('/:submissionId', requireRole('student', 'faculty', 'admin'), (req, res) => {
  const submissionId = Number(req.params.submissionId);
  const result = similarityResults.find((item) => item.submissionId === submissionId);

  if (!result) {
    return res.status(404).json({ message: 'Similarity result not found' });
  }

  return res.json({ result });
});

export default router;