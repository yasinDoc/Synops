import { Router } from 'express';
import {
  listEvaluations,
  getDefenseEvaluations,
  getSingleEvaluation,
  submitEvaluation,
  editEvaluation
} from '../controllers/evaluationController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// List all evaluations
router.get('/', listEvaluations);

// Get evaluations for a specific defense
router.get('/defense/:defenseId', getDefenseEvaluations);

// Get single evaluation by ID
router.get('/:id', getSingleEvaluation);

// Submit marks (faculty, admin/coordinator)
router.post('/', requireRole('faculty', 'admin', 'coordinator'), submitEvaluation);

// Update marks (faculty, admin/coordinator)
router.put('/:id', requireRole('faculty', 'admin', 'coordinator'), editEvaluation);

export default router;