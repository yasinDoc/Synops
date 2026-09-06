import { createSubmission, getAllSubmissions } from '../models/submissionModel.js';
import { extractTextFromBuffer } from '../services/textExtractionService.js';

export function listSubmissions(_req, res) {
  const items = getAllSubmissions();
  return res.json({ items, count: items.length });
}

export async function createSubmissionHandler(req, res) {
  const { thesisId, filePath } = req.body;
  const uploadedFileName = req.file?.originalname;
  const resolvedFilePath = uploadedFileName ? `/uploads/${uploadedFileName}` : filePath;

  if (!thesisId || !resolvedFilePath) {
    return res.status(400).json({ message: 'thesisId and report file are required' });
  }

  let extractedText = '';
  if (req.file?.buffer) {
    extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
  }

  const submission = createSubmission({ thesisId, filePath: resolvedFilePath, extractedText });
  return res.status(201).json({ message: 'Submission saved', submission });
}