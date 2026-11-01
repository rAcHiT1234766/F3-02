/** Gregorian dates at local noon; never convert through a UTC ISO string. */
export function parseDateOnly(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined;
}
export function formatDateOnly(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validateDateBounds(min?: string, max?: string) {
  if ((min && !parseDateOnly(min)) || (max && !parseDateOnly(max)) || (min && max && min > max))
    throw new Error('Dates must be valid YYYY-MM-DD values and min must not exceed max.');
}
export function dateError(value: string, min?: string, max?: string): string | undefined {
  if (value && !parseDateOnly(value)) return 'Enter a valid date in YYYY-MM-DD format.';
  if (value && min && value < min) return `Choose ${min} or later.`;
  if (value && max && value > max) return `Choose ${max} or earlier.`;
  return undefined;
}
