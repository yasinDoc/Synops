import { Router } from 'express';
import { theses, createThesis } from '../store/thesesStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    items: theses,
    count: theses.length
  });
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

export default router;
