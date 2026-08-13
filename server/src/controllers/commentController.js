import { createComment, getCommentsByThesisId } from '../models/commentModel.js';

export function listCommentsByThesis(req, res) {
  const items = getCommentsByThesisId(req.params.thesisId);
  return res.json({ items });
}

export function createCommentHandler(req, res) {
  const { thesisId, authorId, content } = req.body;

  if (!thesisId || !authorId || !content) {
    return res.status(400).json({ message: 'thesisId, authorId, and content are required' });
  }

  const comment = createComment({ thesisId, authorId, content });
  return res.status(201).json({ message: 'Comment saved', comment });
}