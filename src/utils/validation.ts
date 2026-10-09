/**
 * Validates whether the raw input can be normalized to a valid phone number.
 * Requires at least 7 digits (up to 15 digits).
 */
export function isValidPhoneNumber(input: string): boolean {
  if (!input) return false;
  const digits = input.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Validates a Date of Birth string format (YYYY-MM-DD or DD/MM/YYYY).
 */
export function isValidDobString(input: string): boolean {
  if (!input) return false;
  const date = new Date(input);
  if (isNaN(date.getTime())) return false;
  const year = date.getUTCFullYear();
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
}
