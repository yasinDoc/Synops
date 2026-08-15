import { Router } from 'express';
import { checkSimilarity, getSimilarityBySubmission } from '../controllers/similarityController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/check', requireRole('student', 'faculty', 'admin'), checkSimilarity);

router.get('/:submissionId', requireRole('student', 'faculty', 'admin'), getSimilarityBySubmission);

export default router;