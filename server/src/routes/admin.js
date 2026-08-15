import { Router } from 'express';
import { getAllUsers, getFacultyUsers } from '../store/usersStore.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// GET /api/admin/users - Admin User List View endpoint
router.get('/users', (_req, res) => {
  const users = getAllUsers();
  return res.json({ items: users, count: users.length });
});

// GET /api/admin/faculty - Admin list faculty users for dropdown selection
router.get('/faculty', (_req, res) => {
  const faculty = getFacultyUsers();
  return res.json({ items: faculty, count: faculty.length });
});

export default router;
