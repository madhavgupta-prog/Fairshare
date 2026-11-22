import { useMemo, useState } from 'react';
import HeroCTAs from '../components/dashboard/HeroCTAs';
import JoinTripModal from '../components/dashboard/JoinTripModal';
import NewTripModal from '../components/dashboard/NewTripModal';
import TripHistoryPreview from '../components/dashboard/TripHistoryPreview';
import PageShell from '../components/layout/PageShell';
import ActiveTripsGrid from '../components/trip/ActiveTripsGrid';
import { useAuth } from '../context/AuthProvider';
import { computeBalances } from '../lib/balances';
import { formatMoney } from '../lib/format';
import { useTripData } from '../mocks/store';

export default function Dashboard() {
  const { profile } = useAuth();
  const { trips } = useTripData();
  const [showNew, setShowNew] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const userId = profile?.id ?? '';

  const myTrips = useMemo(
    () => trips.filter((t) => t.trip_members.some((m) => m.user_id === userId)),
    [trips, userId],
  );

  const active = myTrips.filter((t) => t.status !== 'settled');
  const settled = myTrips.filter((t) => t.status === 'settled');

  const { owed, owing } = useMemo(() => {
    let owedTotal = 0;
    let owingTotal = 0;
    for (const trip of active) {
      const bal = computeBalances(trip.expenses, trip.trip_members)[userId] ?? 0;
      if (bal > 0.5) owedTotal += bal;
      else if (bal < -0.5) owingTotal += -bal;
    }
    return { owed: owedTotal, owing: owingTotal };
  }, [active, userId]);

  return (
    <PageShell
      title={`Hey ${profile?.name.split(' ')[0] ?? 'there'}`}
      subtitle={`${active.length} active ${active.length === 1 ? 'trip' : 'trips'} · ${settled.length} settled`}
    >
      <div className="space-y-6">
        <HeroCTAs onNewTrip={() => setShowNew(true)} onJoinTrip={() => setShowJoin(true)} />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="You are owed" value={formatMoney(owed)} tone="gold" />
          <StatCard label="You owe" value={formatMoney(owing)} tone="coral" />
          <StatCard
            label="Net position"
            value={`${owed - owing >= 0 ? '+' : '−'}${formatMoney(owed - owing)}`}
            tone={owed - owing >= 0 ? 'teal' : 'coral'}
          />
        </div>

        <section>
          <h2 className="font-display mb-3 text-lg font-semibold">Active trips</h2>
          <ActiveTripsGrid
            trips={active}
            userId={userId}
            emptyMessage="No active trips — start one to begin tracking expenses."
          />
        </section>

        <TripHistoryPreview trips={settled.slice(0, 3)} userId={userId} />
      </div>

      {showNew && <NewTripModal onClose={() => setShowNew(false)} />}
      {showJoin && <JoinTripModal onClose={() => setShowJoin(false)} />}
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'gold' | 'coral' | 'teal';
}) {
  const color = {
    gold: 'var(--gold)',
    coral: 'var(--coral)',
    teal: 'var(--teal)',
  }[tone];

  return (
    <div className="card p-5">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="money mt-2 text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
