import { Router } from 'express';
import { createCommentHandler, listCommentsByThesis } from '../controllers/commentController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/thesis/:thesisId', listCommentsByThesis);

router.post('/', requireRole('student', 'faculty', 'admin'), createCommentHandler);

export default router;