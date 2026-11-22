import type { Expense, SettlementTxn, TripMember } from './types';

export type BalanceMap = Record<string, number>;

/**
 * Positive balance = the member is owed money.
 * Negative balance = the member owes money.
 */
export function computeBalances(
  expenses: Expense[],
  members: Pick<TripMember, 'user_id'>[],
): BalanceMap {
  const balance: BalanceMap = Object.fromEntries(members.map((m) => [m.user_id, 0]));
  for (const e of expenses) {
    for (const p of e.expense_payers) balance[p.user_id] = (balance[p.user_id] ?? 0) + p.amount_paid;
    for (const s of e.expense_splits) balance[s.user_id] = (balance[s.user_id] ?? 0) - s.amount_owed;
  }
  return balance;
}

/** Greedy min-transaction settlement: biggest debtor pays biggest creditor. */
export function computeSettlements(balance: BalanceMap): SettlementTxn[] {
  const creditors: { userId: string; amt: number }[] = [];
  const debtors: { userId: string; amt: number }[] = [];
  for (const [userId, amt] of Object.entries(balance)) {
    if (amt > 0.5) creditors.push({ userId, amt });
    else if (amt < -0.5) debtors.push({ userId, amt: -amt });
  }
  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);
  const txns: SettlementTxn[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    txns.push({ from: debtors[i].userId, to: creditors[j].userId, amount: pay });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt < 0.5) i++;
    if (creditors[j].amt < 0.5) j++;
  }
  return txns;
}

/** Total spend across a trip's expenses. */
export function totalSpend(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
