/** Section 7 — standard UPI deep link, no gateway needed. */
export function buildUpiLink(opts: {
  upiId: string;
  name: string;
  amount: number;
  note: string;
}): string {
  const params = new URLSearchParams({
    pa: opts.upiId,
    pn: opts.name,
    am: opts.amount.toFixed(2),
    cu: 'INR',
    tn: opts.note,
  });
  return `upi://pay?${params.toString()}`;
}
