import { Router } from 'express';
import {
  listDefenseSchedules,
  getDefenseSchedule,
  scheduleDefense,
  editDefenseSchedule,
  assignBoardMembersToDefense
} from '../controllers/defenseController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// List all defense schedules
router.get('/', listDefenseSchedules);

// Get single defense schedule
router.get('/:id', getDefenseSchedule);

// Create defense schedule (admin/coordinator)
router.post('/', requireRole('admin', 'coordinator'), scheduleDefense);

// Update defense schedule (admin/coordinator)
router.put('/:id', requireRole('admin', 'coordinator'), editDefenseSchedule);

// Assign board members to defense schedule
router.post('/:id/assign-board', requireRole('admin', 'coordinator'), assignBoardMembersToDefense);

export default router;