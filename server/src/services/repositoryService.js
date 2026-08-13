export function searchThesesByTitleOrStudent(theses, query) {
  const text = String(query || '').trim().toLowerCase();

  if (!text) {
    return theses;
  }

  return theses.filter((thesis) => {
    const title = String(thesis.title || '').toLowerCase();
    const studentName = String(thesis.studentName || '').toLowerCase();
    return title.includes(text) || studentName.includes(text);
  });
}