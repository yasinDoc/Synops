import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const comments = [
  {
    id: 1,
    thesisId: 1,
    authorId: 2,
    content: 'Please refine the research question.',
    createdAt: new Date().toISOString()
  }
];

const router = Router();

router.use(requireAuth);

router.get('/thesis/:thesisId', (req, res) => {
  const thesisId = Number(req.params.thesisId);
  res.json({
    items: comments.filter((comment) => comment.thesisId === thesisId)
  });
});

router.post('/', requireRole('student', 'faculty', 'admin'), (req, res) => {
  const { thesisId, authorId, content } = req.body;

  if (!thesisId || !authorId || !content) {
    return res.status(400).json({ message: 'thesisId, authorId, and content are required' });
  }

  const comment = {
    id: comments.length + 1,
    thesisId: Number(thesisId),
    authorId: Number(authorId),
    content,
    createdAt: new Date().toISOString()
  };

  comments.push(comment);

  return res.status(201).json({ message: 'Comment saved', comment });
});

export default router;