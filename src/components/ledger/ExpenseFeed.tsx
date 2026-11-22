import type { Expense, TripMember } from '../../lib/types';
import ExpenseItem from './ExpenseItem';

export default function ExpenseFeed({
  expenses,
  members,
  userId,
}: {
  expenses: Expense[];
  members: TripMember[];
  userId: string;
}) {
  const ordered = [...expenses].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <section className="card p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Expenses</h2>
        <span className="text-xs text-[color:var(--muted)]">{expenses.length} logged</span>
      </div>

      {ordered.length === 0 ? (
        <p className="py-8 text-center text-sm text-[color:var(--muted)]">
          Nothing logged yet — add the first expense above.
        </p>
      ) : (
        <ul>
          {ordered.map((e) => (
            <ExpenseItem key={e.id} expense={e} members={members} userId={userId} />
          ))}
        </ul>
      )}
    </section>
  );
}
