import { Router } from 'express';
import {
  createThesisHandler,
  getThesisById,
  listTheses,
  searchTheses,
  updateThesisStatusHandler
} from '../controllers/thesisController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listTheses);
router.get('/search', searchTheses);
router.get('/:id', getThesisById);
router.post('/', requireRole('student', 'admin'), createThesisHandler);
router.patch('/:id/status', requireRole('faculty', 'admin'), updateThesisStatusHandler);

export default router;
