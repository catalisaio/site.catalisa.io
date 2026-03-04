/**
 * Shared validation utility for sandbox blocks.
 * Uses the `validation` prop from course data when available,
 * falls back to sandbox-specific internal logic when type is 'custom' or validation is undefined.
 */
export function validateSandbox(
  validation: { type: string; expected?: unknown } | undefined,
  currentValue: unknown,
): boolean {
  if (!validation) return false;

  switch (validation.type) {
    case 'exact':
      return JSON.stringify(currentValue) === JSON.stringify(validation.expected);

    case 'contains': {
      const expected = validation.expected;
      if (typeof currentValue === 'string' && typeof expected === 'string') {
        return currentValue.toLowerCase().includes(expected.toLowerCase());
      }
      if (Array.isArray(currentValue) && Array.isArray(expected)) {
        return expected.every(item => currentValue.includes(item));
      }
      return false;
    }

    case 'custom':
      // custom type means the sandbox handles its own validation
      return false;

    default:
      return false;
  }
}

/**
 * Validates a URL is well-formed (not just "longer than 5 chars").
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates JSON string is parseable and non-empty.
 */
export function isValidJson(json: string): boolean {
  if (!json.trim()) return false;
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}
