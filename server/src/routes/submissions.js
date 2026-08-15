import { Router } from 'express';
import { createSubmissionHandler, listSubmissions } from '../controllers/submissionController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { uploadSingleReport } from '../middlewares/upload.js';

const router = Router();

router.use(requireAuth);

router.get('/', listSubmissions);

router.post('/', requireRole('student', 'admin'), uploadSingleReport, createSubmissionHandler);

export default router;