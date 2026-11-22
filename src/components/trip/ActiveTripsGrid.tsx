import type { Trip } from '../../lib/types';
import TripCard from './TripCard';

export default function ActiveTripsGrid({
  trips,
  userId,
  emptyMessage = 'No trips yet.',
}: {
  trips: Trip[];
  userId: string;
  emptyMessage?: string;
}) {
  if (trips.length === 0) {
    return (
      <div className="card p-8 text-center text-sm text-[color:var(--muted)]">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} userId={userId} />
      ))}
    </div>
  );
}
