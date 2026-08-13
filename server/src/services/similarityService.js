import { upsertSimilarityResult } from '../models/similarityModel.js';

export function runFakeSimilarityCheck(submissionId) {
  const normalizedSubmissionId = Number(submissionId);
  const similarityPct = 12 + (normalizedSubmissionId % 4) * 6;

  const result = {
    submissionId: normalizedSubmissionId,
    similarityPct,
    matchedNote: 'Matched paragraph: project summary and related work section.'
  };

  return upsertSimilarityResult(result);
}