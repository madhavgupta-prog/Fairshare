import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AddExpenseCard from '../components/ledger/AddExpenseCard';
import BalanceSummary from '../components/ledger/BalanceSummary';
import ExpenseFeed from '../components/ledger/ExpenseFeed';
import SettleUpPanel from '../components/ledger/SettleUpPanel';
import TripHeaderBanner from '../components/ledger/TripHeaderBanner';
import { useAuth } from '../context/AuthProvider';
import { computeBalances } from '../lib/balances';
import { useTripData } from '../mocks/store';

export default function TripLedger() {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTrip, setTripStatus } = useTripData();
  const { profile } = useAuth();

  const trip = tripId ? getTrip(tripId) : undefined;
  const userId = profile?.id ?? '';

  const balances = useMemo(
    () => (trip ? computeBalances(trip.expenses, trip.trip_members) : {}),
    [trip],
  );

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">Trip not found</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            It may have been deleted, or you're not a member.
          </p>
          <Link to="/dashboard" className="btn-gold mt-6 inline-block px-5 py-2.5 text-sm">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <TripHeaderBanner trip={trip} />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {trip.status !== 'settled' && <AddExpenseCard trip={trip} />}
            <ExpenseFeed
              expenses={trip.expenses}
              members={trip.trip_members}
              userId={userId}
            />
          </div>

          <div className="space-y-6">
            <BalanceSummary balances={balances} members={trip.trip_members} userId={userId} />
            <SettleUpPanel trip={trip} balances={balances} userId={userId} />

            {trip.status !== 'settled' ? (
              <button
                type="button"
                onClick={() => setTripStatus(trip.id, 'settled')}
                className="btn-ghost w-full px-4 py-2.5 text-sm"
              >
                Close out this trip
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setTripStatus(trip.id, 'active')}
                className="btn-ghost w-full px-4 py-2.5 text-sm"
              >
                Reopen trip
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
