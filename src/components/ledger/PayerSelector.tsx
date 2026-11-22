import { formatMoney } from '../../lib/format';
import type { TripMember } from '../../lib/types';
import Avatar from '../layout/Avatar';

export interface PayerState {
  mode: 'single' | 'multiple';
  singleId: string;
  amounts: Record<string, string>;
}

export default function PayerSelector({
  members,
  total,
  value,
  onChange,
}: {
  members: TripMember[];
  total: number;
  value: PayerState;
  onChange: (next: PayerState) => void;
}) {
  const enteredTotal = Object.values(value.amounts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[color:var(--muted)]">Paid by</span>
        <button
          type="button"
          onClick={() =>
            onChange({ ...value, mode: value.mode === 'single' ? 'multiple' : 'single' })
          }
          className="text-xs text-[color:var(--gold)] hover:underline"
        >
          {value.mode === 'single' ? 'Split across payers' : 'Single payer'}
        </button>
      </div>

      {value.mode === 'single' ? (
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ ...value, singleId: m.user_id })}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs ${
                value.singleId === m.user_id
                  ? 'border-[color:var(--gold)] bg-[color:var(--surface-2)]'
                  : 'border-[color:var(--edge)] hover:bg-[color:var(--surface-2)]'
              }`}
            >
              <Avatar name={m.profiles.name} url={m.profiles.avatar_url} size={20} />
              {m.profiles.name.split(' ')[0]}
            </button>
          ))}
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
