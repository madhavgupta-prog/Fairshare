import { Link } from 'react-router-dom';
import { computeBalances, totalSpend } from '../../lib/balances';
import { formatDateRange, formatMoney } from '../../lib/format';
import type { Trip } from '../../lib/types';
import Avatar from '../layout/Avatar';

export default function HistoryList({ trips, userId }: { trips: Trip[]; userId: string }) {
  if (trips.length === 0) {
    return (
      <div className="card p-8 text-center text-sm text-[color:var(--muted)]">
        No settled trips yet. Close out a trip and it'll land here.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {trips.map((trip) => {
        const myBalance = computeBalances(trip.expenses, trip.trip_members)[userId] ?? 0;
        return (
          <li key={trip.id}>
            <Link
              to={`/trip/${trip.id}`}
              className="card flex flex-wrap items-center gap-4 p-4 transition-colors hover:border-[color:var(--gold)]/50"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-display truncate text-base font-semibold">{trip.name}</h3>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                  {formatDateRange(trip.start_date, trip.end_date)} · {trip.expenses.length}{' '}
                  expenses
                </p>
              </div>

              <div className="flex -space-x-2">
                {trip.trip_members.map((m) => (
                  <span key={m.id} className="rounded-full ring-2 ring-[color:var(--surface)]">
                    <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={26} />
                  </span>
                ))}
              </div>

              <div className="text-right">
                <p className="money text-sm">{formatMoney(totalSpend(trip.expenses))}</p>
                <p
                  className="text-xs"
                  style={{
                    color: Math.abs(myBalance) < 0.5 ? 'var(--teal)' : 'var(--muted)',
                  }}
                >
                  {Math.abs(myBalance) < 0.5 ? 'settled' : 'balance carried'}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
