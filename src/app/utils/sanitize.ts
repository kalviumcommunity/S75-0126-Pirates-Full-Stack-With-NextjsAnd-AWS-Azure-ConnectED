import sanitizeHtml from 'sanitize-html';

/**
 * Removes all HTML tags and attributes
 * Prevents XSS attacks
 */
export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
