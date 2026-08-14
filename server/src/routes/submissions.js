import { Router } from 'express';
import { submissions, createSubmission } from '../store/submissionsStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: submissions, count: submissions.length });
});

router.post('/', (req, res) => {
  const { thesisId, filePath } = req.body;

  if (!thesisId || !filePath) {
    return res.status(400).json({ message: 'thesisId and filePath are required' });
  }

  const submission = createSubmission({ thesisId, filePath });

  return res.status(201).json({ message: 'Submission saved', submission });
});

export default router;