import { Link } from 'react-router-dom';
import { computeBalances, totalSpend } from '../../lib/balances';
import { formatDateRange, formatMoney } from '../../lib/format';
import type { Trip } from '../../lib/types';
import Avatar from '../layout/Avatar';

const statusStyles: Record<Trip['status'], string> = {
  draft: 'text-[color:var(--muted)] border-[color:var(--edge)]',
  active: 'text-[color:var(--gold)] border-[color:var(--gold)]/40',
  settled: 'text-[color:var(--teal)] border-[color:var(--teal)]/40',
};

export default function TripCard({ trip, userId }: { trip: Trip; userId: string }) {
  const balances = computeBalances(trip.expenses, trip.trip_members);
  const myBalance = balances[userId] ?? 0;
  const total = totalSpend(trip.expenses);
  const visibleMembers = trip.trip_members.slice(0, 4);
  const overflow = trip.trip_members.length - visibleMembers.length;

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="card block p-5 transition-colors hover:border-[color:var(--gold)]/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{trip.name}</h3>
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">
            {formatDateRange(trip.start_date, trip.end_date)}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] tracking-wide uppercase ${statusStyles[trip.status]}`}
        >
          {trip.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex -space-x-2">
          {visibleMembers.map((m) => (
            <span key={m.id} className="ring-2 ring-[color:var(--surface)] rounded-full">
              <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={28} />
            </span>
          ))}
          {overflow > 0 && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-[11px] text-[color:var(--muted)] ring-2 ring-[color:var(--surface)]">
              +{overflow}
            </span>
          )}
        </div>

        <div className="text-right">
          <p className="money text-sm">{formatMoney(total)}</p>
          <p className="text-[11px] text-[color:var(--muted)]">
            {trip.expenses.length} {trip.expenses.length === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-[color:var(--edge)] pt-3 text-sm">
        {Math.abs(myBalance) < 0.5 ? (
          <span className="text-[color:var(--teal)]">You're all settled</span>
        ) : myBalance > 0 ? (
          <span className="text-[color:var(--gold)]">
            You are owed <span className="money">{formatMoney(myBalance)}</span>
          </span>
        ) : (
          <span className="text-[color:var(--coral)]">
            You owe <span className="money">{formatMoney(myBalance)}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
