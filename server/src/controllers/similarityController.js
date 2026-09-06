import { findSimilarityBySubmissionId } from '../models/similarityModel.js';
import { runFakeSimilarityCheck } from '../services/similarityService.js';

export function checkSimilarity(req, res) {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ message: 'submissionId is required' });
  }

  try {
    const result = runFakeSimilarityCheck(submissionId);
    return res.status(201).json({ message: 'Similarity check completed', result });
  } catch (err) {
    return res.status(404).json({ message: err.message || 'Similarity check failed' });
  }
}

export function getSimilarityBySubmission(req, res) {
  const result = findSimilarityBySubmissionId(req.params.submissionId);

  if (!result) {
    return res.status(404).json({ message: 'Similarity result not found' });
  }

  return res.json({ result });
}