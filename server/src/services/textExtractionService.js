import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded file buffer based on its mimetype.
 * No external APIs are used - both PDF and DOCX parsing happen locally
 * with pdf-parse / mammoth running directly in this process.
 */
export async function extractTextFromBuffer(buffer, mimetype) {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  try {
    if (mimetype === 'application/pdf') {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return normalizeText(result.text);
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return normalizeText(result.value);
    }

    if (mimetype === 'application/msword') {
      // Legacy .doc binary format isn't supported by mammoth; store nothing
      // rather than guessing at extraction. Similarity check will fall back
      // gracefully to "no comparable text" for this submission.
      return '';
    }
  } catch (err) {
    console.warn(`[textExtraction] Failed to extract text (${mimetype}):`, err.message);
    return '';
  }

  return '';
}

function normalizeText(rawText) {
  return String(rawText || '')
    .replace(/\s+/g, ' ')
    .trim();
}
