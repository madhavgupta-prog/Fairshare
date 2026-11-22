import { formatMoney } from '../../lib/format';
import type { SplitType, TripMember } from '../../lib/types';
import { equalSplit } from '../../lib/validation';
import Avatar from '../layout/Avatar';

export interface SplitState {
  type: SplitType;
  /** Members included in an equal split. */
  included: string[];
  /** Per-member amounts for a custom split. */
  amounts: Record<string, string>;
}

export default function SplitSelector({
  members,
  total,
  value,
  onChange,
}: {
  members: TripMember[];
  total: number;
  value: SplitState;
  onChange: (next: SplitState) => void;
}) {
  const perHead = equalSplit(total, value.included.length);
  const enteredTotal = Object.values(value.amounts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );

  const toggle = (userId: string) =>
    onChange({
      ...value,
      included: value.included.includes(userId)
        ? value.included.filter((id) => id !== userId)
        : [...value.included, userId],
    });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[color:var(--muted)]">Split</span>
        <div className="flex gap-1 text-xs">
          {(['equal', 'custom'] as SplitType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...value, type: t })}
              className={`rounded-full px-2.5 py-1 ${
                value.type === t
                  ? 'bg-[color:var(--surface-2)] text-[color:var(--gold)]'
                  : 'text-[color:var(--muted)] hover:text-[color:var(--cream)]'
              }`}
            >
              {t === 'equal' ? 'Equally' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {value.type === 'equal' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const on = value.included.includes(m.user_id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.user_id)}
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs ${
                    on
                      ? 'border-[color:var(--gold)] bg-[color:var(--surface-2)]'
                      : 'border-[color:var(--edge)] text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]'
                  }`}
                >
                  <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={20} />
                  {m.profiles.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
          {value.included.length > 0 && total > 0 && (
            <p className="text-xs text-[color:var(--muted)]">
              <span className="money">{formatMoney(perHead[0] ?? 0)}</span> each across{' '}
              {value.included.length}{' '}
              {value.included.length === 1 ? 'person' : 'people'}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={26} />
              <span className="flex-1 text-sm">{m.profiles.name}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={value.amounts[m.user_id] ?? ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    amounts: { ...value.amounts, [m.user_id]: e.target.value },
                  })
                }
                className="input money w-28 text-right"
              />
            </div>
          ))}
          <p className="text-right text-xs text-[color:var(--muted)]">
            Entered <span className="money">{formatMoney(enteredTotal)}</span> of{' '}
            <span className="money">{formatMoney(total)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
