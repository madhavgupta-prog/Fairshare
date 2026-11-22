import { useMemo } from 'react';
import PageShell from '../components/layout/PageShell';
import ActiveTripsGrid from '../components/trip/ActiveTripsGrid';
import { useAuth } from '../context/AuthProvider';
import { useTripData } from '../mocks/store';

export default function ActiveTrips() {
  const { profile } = useAuth();
  const { trips } = useTripData();
  const userId = profile?.id ?? '';

  const active = useMemo(
    () =>
      trips.filter(
        (t) => t.status !== 'settled' && t.trip_members.some((m) => m.user_id === userId),
      ),
    [trips, userId],
  );

  return (
    <PageShell
      title="Active trips"
      subtitle={`${active.length} ${active.length === 1 ? 'trip' : 'trips'} in progress`}
    >
      <ActiveTripsGrid
        trips={active}
        userId={userId}
        emptyMessage="No active trips right now."
      />
    </PageShell>
  );
}
