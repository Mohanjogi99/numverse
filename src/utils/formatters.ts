/**
 * Formats a raw digit string into a pleasant masked or segmented readable format.
 * E.g. 7415766779 -> "74157 66779"
 */
export function formatPhoneNumberReadable(digits: string): string {
  if (!digits) return '';
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length > 10) {
    return `${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -5)} ${digits.slice(-5)}`;
  }
  return digits;
}

/**
 * Masks a phone number for privacy display.
 * E.g. 7415766779 -> "741•• ••779"
 */
export function maskPhoneNumber(digits: string): string {
  if (!digits || digits.length < 6) return digits;
  const start = digits.slice(0, 3);
  const end = digits.slice(-3);
  return `${start}•• ••${end}`;
}

/**
 * Formats percentages neatly.
 */
export function formatPercentage(val: number): string {
  return `${val.toFixed(1).replace(/\.0$/, '')}%`;
}
