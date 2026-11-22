import { Link } from 'react-router-dom';
import { computeBalances, totalSpend } from '../../lib/balances';
import { formatDateRange, formatMoney } from '../../lib/format';
import type { Trip } from '../../lib/types';

export default function TripHistoryPreview({
  trips,
  userId,
}: {
  trips: Trip[];
  userId: string;
}) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Recent history</h2>
        <Link to="/history" className="text-xs text-[color:var(--muted)] hover:text-[color:var(--cream)]">
          See all →
        </Link>
      </div>

      {trips.length === 0 ? (
        <p className="py-6 text-center text-sm text-[color:var(--muted)]">
          Settled trips will show up here.
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--edge)]">
          {trips.map((trip) => {
            const myBalance = computeBalances(trip.expenses, trip.trip_members)[userId] ?? 0;
            return (
              <li key={trip.id}>
                <Link
                  to={`/trip/${trip.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:text-[color:var(--gold)]"
                >
                  <span>
                    <span className="block">{trip.name}</span>
                    <span className="block text-xs text-[color:var(--muted)]">
                      {formatDateRange(trip.start_date, trip.end_date)} ·{' '}
                      {trip.trip_members.length} members
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="money block">{formatMoney(totalSpend(trip.expenses))}</span>
                    <span className="block text-xs text-[color:var(--muted)]">
                      {Math.abs(myBalance) < 0.5 ? 'settled' : 'closed out'}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
