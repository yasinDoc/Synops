import { Router } from 'express';
import { submissions, createSubmission } from '../store/submissionsStore.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { uploadSingleReport } from '../middlewares/upload.js';

const router = Router();

router.use(requireAuth);

router.get('/', (_req, res) => {
  res.json({ items: submissions, count: submissions.length });
});

router.post('/', requireRole('student', 'admin'), uploadSingleReport, (req, res) => {
  const { thesisId, filePath } = req.body;
  const uploadedFileName = req.file?.originalname;
  const resolvedFilePath = uploadedFileName ? `/uploads/${uploadedFileName}` : filePath;

  if (!thesisId || !resolvedFilePath) {
    return res.status(400).json({ message: 'thesisId and report file are required' });
  }

  const submission = createSubmission({ thesisId, filePath: resolvedFilePath });

  return res.status(201).json({ message: 'Submission saved', submission });
});

export default router;