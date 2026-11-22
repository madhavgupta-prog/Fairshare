import type { BalanceMap } from '../../lib/balances';
import { formatMoney } from '../../lib/format';
import type { TripMember } from '../../lib/types';
import Avatar from '../layout/Avatar';

export default function BalanceSummary({
  balances,
  members,
  userId,
}: {
  balances: BalanceMap;
  members: TripMember[];
  userId: string;
}) {
  const rows = members
    .map((m) => ({ member: m, amount: balances[m.user_id] ?? 0 }))
    .sort((a, b) => b.amount - a.amount);

  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.amount)));

  return (
    <section className="card p-5">
      <h2 className="font-display mb-4 text-lg font-semibold">Balances</h2>

      <ul className="space-y-3">
        {rows.map(({ member, amount }) => {
          const settled = Math.abs(amount) < 0.5;
          const color = settled
            ? 'var(--muted)'
            : amount > 0
              ? 'var(--teal)'
              : 'var(--coral)';

          return (
            <li key={member.id}>
              <div className="flex items-center gap-3">
                <Avatar name={member.profiles.name} url={member.profiles.avatar_url} size={30} />
                <span className="flex-1 truncate text-sm">
                  {member.user_id === userId ? 'You' : member.profiles.name}
                </span>
                <span className="money text-sm" style={{ color }}>
                  {settled ? '—' : `${amount > 0 ? '+' : '−'}${formatMoney(amount)}`}
                </span>
              </div>

              <div className="mt-1.5 ml-[42px] h-1.5 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(Math.abs(amount) / maxAbs) * 100}%`,
                    background: color,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 border-t border-[color:var(--edge)] pt-3 text-xs text-[color:var(--muted)]">
        Positive means the person is owed money; negative means they owe.
      </p>
    </section>
  );
}
