import { Router } from 'express';
import { theses, createThesis } from '../store/thesesStore.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', (_req, res) => {
  res.json({
    items: theses,
    count: theses.length
  });
});

router.get('/search', (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase();

  if (!query) {
    return res.json({ items: theses, count: theses.length });
  }

  const items = theses.filter((thesis) => {
    const title = String(thesis.title || '').toLowerCase();
    const studentName = String(thesis.studentName || '').toLowerCase();
    return title.includes(query) || studentName.includes(query);
  });

  return res.json({ items, count: items.length });
});

router.get('/:id', (req, res) => {
  const thesis = theses.find((item) => item.id === Number(req.params.id));

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  return res.json({ thesis });
});

router.post('/', requireRole('student', 'admin'), (req, res) => {
  const { title, abstract, studentName, supervisorName } = req.body;

  if (!title || !abstract || !studentName) {
    return res.status(400).json({
      message: 'title, abstract, and studentName are required'
    });
  }

  const thesis = createThesis({ title, abstract, studentName, supervisorName });

  return res.status(201).json({
    message: 'Thesis created successfully',
    thesis
  });
});

router.patch('/:id/status', requireRole('faculty', 'admin'), (req, res) => {
  const thesis = theses.find((item) => item.id === Number(req.params.id));

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }

  thesis.status = status;

  return res.json({
    message: 'Thesis status updated',
    thesis
  });
});

export default router;
