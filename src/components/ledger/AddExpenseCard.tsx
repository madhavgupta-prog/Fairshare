import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../context/AuthProvider';
import type { Trip } from '../../lib/types';
import { equalSplit, validatePayers, validateSplits } from '../../lib/validation';
import { useTripData } from '../../mocks/store';
import PayerSelector from './PayerSelector';
import type { PayerState } from './PayerSelector';
import SplitSelector from './SplitSelector';
import type { SplitState } from './SplitSelector';

export default function AddExpenseCard({ trip }: { trip: Trip }) {
  const { profile } = useAuth();
  const { addExpense } = useTripData();
  const memberIds = useMemo(() => trip.trip_members.map((m) => m.user_id), [trip.trip_members]);

  const [description, setDescription] = useState('');
  const [amountText, setAmountText] = useState('');
  const [payer, setPayer] = useState<PayerState>({
    mode: 'single',
    singleId: profile?.id ?? memberIds[0],
    amounts: {},
  });
  const [split, setSplit] = useState<SplitState>({
    type: 'equal',
    included: memberIds,
    amounts: {},
  });
  const [error, setError] = useState<string | null>(null);

  const amount = parseFloat(amountText) || 0;

  const reset = () => {
    setDescription('');
    setAmountText('');
    setPayer({ mode: 'single', singleId: profile?.id ?? memberIds[0], amounts: {} });
    setSplit({ type: 'equal', included: memberIds, amounts: {} });
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) return setError('Give the expense a description.');
    if (amount <= 0) return setError('Enter an amount greater than zero.');

    const payers =
      payer.mode === 'single'
        ? [{ userId: payer.singleId, amount }]
        : Object.entries(payer.amounts)
            .map(([userId, v]) => ({ userId, amount: parseFloat(v) || 0 }))
            .filter((p) => p.amount > 0);

    const payerError = validatePayers(
      amount,
      payers.map((p) => p.amount),
    );
    if (payerError) return setError(payerError);

    let splits: { userId: string; amount: number }[];
    if (split.type === 'equal') {
      if (split.included.length === 0) return setError('Pick at least one person to split with.');
      const shares = equalSplit(amount, split.included.length);
      splits = split.included.map((userId, i) => ({ userId, amount: shares[i] }));
    } else {
      splits = Object.entries(split.amounts)
        .map(([userId, v]) => ({ userId, amount: parseFloat(v) || 0 }))
        .filter((s) => s.amount > 0);
      const splitError = validateSplits(
        amount,
        splits.map((s) => s.amount),
      );
      if (splitError) return setError(splitError);
    }

    addExpense({
      tripId: trip.id,
      description: description.trim(),
      amount,
      splitType: split.type,
      payers,
      splits,
      createdBy: profile?.id ?? memberIds[0],
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <h2 className="font-display text-lg font-semibold">Add an expense</h2>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-xs text-[color:var(--muted)]">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner at Café 1947"
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-[color:var(--muted)]">Amount (₹)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            placeholder="0.00"
            className="input money sm:w-40 text-right"
          />
        </label>
      </div>

      <div className="border-t border-[color:var(--edge)] pt-4">
        <PayerSelector
          members={trip.trip_members}
          total={amount}
          value={payer}
          onChange={setPayer}
        />
      </div>

      <div className="border-t border-[color:var(--edge)] pt-4">
        <SplitSelector
          members={trip.trip_members}
          total={amount}
          value={split}
          onChange={setSplit}
        />
      </div>

      {error && <p className="text-sm text-[color:var(--coral)]">{error}</p>}

      <div className="flex justify-end gap-2 border-t border-[color:var(--edge)] pt-4">
        <button type="button" onClick={reset} className="btn-ghost px-4 py-2 text-sm">
          Clear
        </button>
        <button type="submit" className="btn-gold px-5 py-2 text-sm">
          Add expense
        </button>
      </div>
    </form>
  );
}
