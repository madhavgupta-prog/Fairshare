import { useState } from 'react';
import { formatMoney, relativeTime } from '../../lib/format';
import type { Expense, TripMember } from '../../lib/types';
import Avatar from '../layout/Avatar';

export default function ExpenseItem({
  expense,
  members,
  userId,
}: {
  expense: Expense;
  members: TripMember[];
  userId: string;
}) {
  const [open, setOpen] = useState(false);

  const nameOf = (id: string) =>
    members.find((m) => m.user_id === id)?.profiles.name ?? 'Unknown';
  const profileOf = (id: string) => members.find((m) => m.user_id === id)?.profiles;

  const payerLabel =
    expense.expense_payers.length === 1
      ? nameOf(expense.expense_payers[0].user_id)
      : `${expense.expense_payers.length} people`;

  const myShare =
    expense.expense_splits.find((s) => s.user_id === userId)?.amount_owed ?? 0;
  const myPaid = expense.expense_payers.find((p) => p.user_id === userId)?.amount_paid ?? 0;
  const myNet = myPaid - myShare;

  const firstPayer = profileOf(expense.expense_payers[0]?.user_id ?? '');

  return (
    <li className="border-b border-[color:var(--edge)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-1 py-3 text-left"
        aria-expanded={open}
      >
        <Avatar name={firstPayer?.name ?? '?'} url={firstPayer?.avatar_url} size={34} />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{expense.description}</span>
          <span className="block text-xs text-[color:var(--muted)]">
            {payerLabel} paid · {relativeTime(expense.created_at)}
            {expense.split_type === 'custom' && ' · custom split'}
          </span>
        </span>

        <span className="text-right">
          <span className="money block text-sm">{formatMoney(expense.amount)}</span>
          <span
            className="block text-xs"
            style={{
              color:
                Math.abs(myNet) < 0.5
                  ? 'var(--muted)'
                  : myNet > 0
                    ? 'var(--gold)'
                    : 'var(--coral)',
            }}
          >
            {Math.abs(myNet) < 0.5
              ? 'not involved'
              : myNet > 0
                ? `you lent ${formatMoney(myNet)}`
                : `you owe ${formatMoney(myNet)}`}
          </span>
        </span>
      </button>

      {open && (
        <div className="mb-3 rounded-2xl bg-[color:var(--surface-2)] p-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[color:var(--muted)]">Paid by</p>
              <ul className="space-y-1.5">
                {expense.expense_payers.map((p) => (
                  <li key={p.id} className="flex justify-between gap-3">
                    <span>{nameOf(p.user_id)}</span>
                    <span className="money">{formatMoney(p.amount_paid)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[color:var(--muted)]">Split between</p>
              <ul className="space-y-1.5">
                {expense.expense_splits.map((s) => (
                  <li key={s.id} className="flex justify-between gap-3">
                    <span>{nameOf(s.user_id)}</span>
                    <span className="money">{formatMoney(s.amount_owed)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
