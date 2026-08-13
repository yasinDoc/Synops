const comments = [
  {
    id: 1,
    thesisId: 1,
    authorId: 2,
    content: 'Please refine the research question.',
    createdAt: new Date().toISOString()
  }
];

export function getCommentsByThesisId(thesisId) {
  return comments.filter((comment) => comment.thesisId === Number(thesisId));
}

export function createComment({ thesisId, authorId, content }) {
  const comment = {
    id: comments.length + 1,
    thesisId: Number(thesisId),
    authorId: Number(authorId),
    content,
    createdAt: new Date().toISOString()
  };

  comments.push(comment);
  return comment;
}