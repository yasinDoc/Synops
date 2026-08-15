const similarityResults = [
  {
    submissionId: 1,
    similarityPct: 18,
    matchedNote: 'Matched paragraph: literature review on thesis workflow systems.'
  }
];

export function upsertSimilarityResult(result) {
  const existingIndex = similarityResults.findIndex((item) => item.submissionId === Number(result.submissionId));

  if (existingIndex >= 0) {
    similarityResults[existingIndex] = result;
  } else {
    similarityResults.push(result);
  }

  return result;
}

export function findSimilarityBySubmissionId(submissionId) {
  return similarityResults.find((item) => item.submissionId === Number(submissionId)) || null;
}