import type { BalanceMap } from '../../lib/balances';
import { computeSettlements } from '../../lib/balances';
import { formatMoney } from '../../lib/format';
import type { Trip } from '../../lib/types';
import { useTripData } from '../../mocks/store';
import Avatar from '../layout/Avatar';
import UpiPayButton from './UpiPayButton';

export default function SettleUpPanel({
  trip,
  balances,
  userId,
}: {
  trip: Trip;
  balances: BalanceMap;
  userId: string;
}) {
  const { recordSettlement } = useTripData();
  const txns = computeSettlements(balances);

  const profileOf = (id: string) => trip.trip_members.find((m) => m.user_id === id)?.profiles;
  const nameOf = (id: string) => (id === userId ? 'You' : (profileOf(id)?.name ?? 'Unknown'));

  const settledTxns = trip.settlements.filter((s) => s.settled_at);

  return (
    <section className="card p-5">
      <h2 className="font-display mb-4 text-lg font-semibold">Settle up</h2>

      {txns.length === 0 ? (
        <p className="py-4 text-center text-sm text-[color:var(--teal)]">
          Everyone's square. Nothing to settle.
        </p>
      ) : (
        <ul className="space-y-3">
          {txns.map((t, i) => {
            const recipient = profileOf(t.to);
            return (
              <li
                key={`${t.from}-${t.to}-${i}`}
                className="rounded-2xl bg-[color:var(--surface-2)] p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Avatar name={nameOf(t.from)} url={profileOf(t.from)?.avatar_url} size={24} />
                  <span className="truncate">{nameOf(t.from)}</span>
                  <span className="text-[color:var(--muted)]">→</span>
                  <Avatar name={nameOf(t.to)} url={recipient?.avatar_url} size={24} />
                  <span className="truncate">{nameOf(t.to)}</span>
                  <span className="money ml-auto text-[color:var(--gold)]">
                    {formatMoney(t.amount)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {t.from === userId && (
                    <UpiPayButton
                      recipient={recipient}
                      amount={t.amount}
                      note={`FairShare · ${trip.name}`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => recordSettlement(trip.id, t.from, t.to, t.amount)}
                    className="btn-ghost px-3 py-1.5 text-xs"
                  >
                    Mark settled
                  </button>
                </div>

                {!recipient?.upi_id && t.from === userId && (
                  <p className="mt-2 text-right text-[11px] text-[color:var(--muted)]">
                    Ask them to add a UPI ID in Profile.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {settledTxns.length > 0 && (
        <div className="mt-5 border-t border-[color:var(--edge)] pt-4">
          <p className="mb-2 text-xs text-[color:var(--muted)]">Already settled</p>
          <ul className="space-y-1.5 text-xs">
            {settledTxns.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="text-[color:var(--teal)]">✓</span>
                <span className="truncate">
                  {nameOf(s.from_user)} paid {nameOf(s.to_user)}
                </span>
                <span className="money ml-auto">{formatMoney(s.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
