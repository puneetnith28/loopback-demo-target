/**
 * Format a string into a sanitized token with custom delimiter and character replacements.
 *
 * @param {string} input - The raw input string to format.
 * @param {object} [options] - Formatting options.
 * @param {string} [options.delimiter='-'] - Delimiter character separating tokens.
 * @param {boolean} [options.lowercase=true] - Whether to lowercase the result.
 * @param {Record<string, string|null>} [options.replace={}] - Character replacement mapping.
 * @returns {string} Sanitized formatted token.
 */
export function formatToken(input, options = {}) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const {
    delimiter = '-',
    lowercase = true,
    replace = {},
  } = options;

  let text = lowercase ? input.toLowerCase() : input;

  // Apply custom character replacements
  for (const [key, value] of Object.entries(replace)) {
    // A null or undefined mapping removes the matched character
    const replacement = value == null ? '' : value.toString();
    text = text.replaceAll(key, replacement);
  }

  // Replace non-alphanumeric characters with the delimiter
  const sanitized = text
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, delimiter)
    .replace(new RegExp(`^\\${delimiter}+|\\${delimiter}+$`, 'g'), '');

  return sanitized;
}
