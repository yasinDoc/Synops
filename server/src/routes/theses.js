import { Router } from 'express';
import { theses, createThesis } from '../store/thesesStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    items: theses,
    count: theses.length
  });
});

router.get('/:id', (req, res) => {
  const thesis = theses.find((item) => item.id === Number(req.params.id));

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  return res.json({ thesis });
});

router.post('/', (req, res) => {
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

router.patch('/:id/status', (req, res) => {
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
