import { useMemo } from 'react';
import HistoryList from '../components/history/HistoryList';
import PageShell from '../components/layout/PageShell';
import { useAuth } from '../context/AuthProvider';
import { totalSpend } from '../lib/balances';
import { formatMoney } from '../lib/format';
import { useTripData } from '../mocks/store';

export default function History() {
  const { profile } = useAuth();
  const { trips } = useTripData();
  const userId = profile?.id ?? '';

  const settled = useMemo(
    () =>
      trips
        .filter((t) => t.status === 'settled' && t.trip_members.some((m) => m.user_id === userId))
        .sort(
          (a, b) =>
            new Date(b.end_date ?? b.created_at).getTime() -
            new Date(a.end_date ?? a.created_at).getTime(),
        ),
    [trips, userId],
  );

  const lifetimeTotal = settled.reduce((sum, t) => sum + totalSpend(t.expenses), 0);

  return (
    <PageShell
      title="History"
      subtitle={`${settled.length} settled ${settled.length === 1 ? 'trip' : 'trips'} · ${formatMoney(lifetimeTotal)} tracked`}
    >
      <HistoryList trips={settled} userId={userId} />
    </PageShell>
  );
}
