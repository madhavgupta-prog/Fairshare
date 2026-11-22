import { totalSpend } from '../../lib/balances';
import { formatDateRange, formatMoney } from '../../lib/format';
import type { Trip } from '../../lib/types';
import Avatar from '../layout/Avatar';

export default function TripHeaderBanner({ trip }: { trip: Trip }) {
  return (
    <section className="card relative overflow-hidden p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url('/mountain.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{trip.name}</h1>
            {trip.description && (
              <p className="mt-1 text-sm text-[color:var(--muted)]">{trip.description}</p>
            )}
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              {formatDateRange(trip.start_date, trip.end_date)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-[color:var(--muted)]">Total spent</p>
            <p className="money text-2xl font-semibold text-[color:var(--gold)]">
              {formatMoney(totalSpend(trip.expenses))}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {trip.trip_members.map((m) => (
                <span key={m.id} className="rounded-full ring-2 ring-[color:var(--surface)]">
                  <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={30} />
                </span>
              ))}
            </div>
            <span className="text-xs text-[color:var(--muted)]">
              {trip.trip_members.length} members
            </span>
          </div>

          <span className="ml-auto text-xs text-[color:var(--muted)]">
            Invite code{' '}
            <span className="money rounded-lg border border-[color:var(--edge)] px-2 py-1 tracking-widest text-[color:var(--cream)]">
              {trip.invite_code}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
