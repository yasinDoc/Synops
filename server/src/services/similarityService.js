import { upsertSimilarityResult } from '../models/similarityModel.js';
import { getAllSubmissions, findSubmissionById } from '../models/submissionModel.js';
import { runSimilarityWithFallback } from './similarityAlgorithms.js';

export function runFakeSimilarityCheck(submissionId) {
  const normalizedSubmissionId = Number(submissionId);
  const submission = findSubmissionById(normalizedSubmissionId);

  if (!submission) {
    throw new Error('Submission not found');
  }

  // Compare against every other submission's extracted text, excluding
  // other versions of the same thesis (those are expected to be similar).
  const corpus = getAllSubmissions().filter(
    (item) => item.id !== normalizedSubmissionId && item.thesisId !== submission.thesisId
  );

  const corpusTexts = corpus.map((item) => item.extractedText || '');
  const targetText = submission.extractedText || '';

  const { algorithm, similarityPct, matchedIndex, usedFallback, fallbackReason } =
    runSimilarityWithFallback(targetText, corpusTexts);

  const matchedSubmission = matchedIndex >= 0 ? corpus[matchedIndex] : null;

  const result = {
    submissionId: normalizedSubmissionId,
    similarityPct,
    algorithmUsed: algorithm,
    usedFallback,
    matchedNote: matchedSubmission
      ? `Highest overlap found with submission #${matchedSubmission.id} (thesis #${matchedSubmission.thesisId}).`
      : 'No comparable prior submissions with extractable text were found.',
    ...(usedFallback ? { fallbackReason } : {})
  };

  return upsertSimilarityResult(result);
}