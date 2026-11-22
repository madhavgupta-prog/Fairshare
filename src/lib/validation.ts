/**
 * Client-side mirror of the DB trigger in Section 5 of the spec.
 * The database is the real enforcement point; these keep the form honest.
 */
const TOLERANCE = 0.5;

export function sumsMatch(total: number, parts: number[]): boolean {
  const sum = parts.reduce((a, b) => a + b, 0);
  return Math.abs(sum - total) <= TOLERANCE;
}

export function validatePayers(total: number, amounts: number[]): string | null {
  if (amounts.some((a) => a < 0)) return 'Paid amounts cannot be negative.';
  if (!sumsMatch(total, amounts)) return 'Payer amounts must add up to the expense total.';
  return null;
}

export function validateSplits(total: number, amounts: number[]): string | null {
  if (amounts.some((a) => a < 0)) return 'Split amounts cannot be negative.';
  if (!sumsMatch(total, amounts)) return 'Split amounts must add up to the expense total.';
  return null;
}

/** Split `total` across `count` people, pushing rounding remainder onto the first shares. */
export function equalSplit(total: number, count: number): number[] {
  if (count <= 0) return [];
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;
  return Array.from({ length: count }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100);
}
