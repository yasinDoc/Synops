import { createSubmission, getAllSubmissions } from '../models/submissionModel.js';

export function listSubmissions(_req, res) {
  const items = getAllSubmissions();
  return res.json({ items, count: items.length });
}

export function createSubmissionHandler(req, res) {
  const { thesisId, filePath } = req.body;
  const uploadedFileName = req.file?.originalname;
  const resolvedFilePath = uploadedFileName ? `/uploads/${uploadedFileName}` : filePath;

  if (!thesisId || !resolvedFilePath) {
    return res.status(400).json({ message: 'thesisId and report file are required' });
  }

  const submission = createSubmission({ thesisId, filePath: resolvedFilePath });
  return res.status(201).json({ message: 'Submission saved', submission });
}