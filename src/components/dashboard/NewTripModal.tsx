import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useTripData } from '../../mocks/store';
import Avatar from '../layout/Avatar';

type Step = 'details' | 'friends';

export default function NewTripModal({ onClose }: { onClose: () => void }) {
  const { profile } = useAuth();
  const { people, createTrip } = useTripData();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const candidates = people.filter(
    (p) =>
      p.id !== profile?.id &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.email.toLowerCase().includes(query.toLowerCase())),
  );

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleCreate = () => {
    if (!profile) return;
    const trip = createTrip({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      memberIds: selected,
      createdBy: profile.id,
    });
    onClose();
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">New trip</h2>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              {step === 'details' ? 'Step 1 of 2 — trip details' : 'Step 2 of 2 — add friends'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[color:var(--muted)] hover:text-[color:var(--cream)]"
          >
            ✕
          </button>
        </div>

        {step === 'details' ? (
          <div className="mt-5 space-y-4">
            <Field label="Trip name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manali Winter Escape"
                className="input"
              />
            </Field>
            <Field label="Description">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="End date">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep('friends')}
                className="btn-gold px-4 py-2 text-sm"
              >
                Add friends
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <Field label="Search by name or email">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="meera@…"
                className="input"
              />
            </Field>

            <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
              {candidates.map((p) => {
                const isOn = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm ${
                      isOn
                        ? 'border-[color:var(--gold)]/50 bg-[color:var(--surface-2)]'
                        : 'border-[color:var(--edge)] hover:bg-[color:var(--surface-2)]'
                    }`}
                  >
                    <Avatar name={p.name} url={p.avatar_url} size={30} />
                    <span className="flex-1">
                      <span className="block">{p.name}</span>
                      <span className="block text-xs text-[color:var(--muted)]">{p.email}</span>
                    </span>
                    <span className={isOn ? 'text-[color:var(--gold)]' : 'text-[color:var(--muted)]'}>
                      {isOn ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
              {candidates.length === 0 && (
                <p className="py-4 text-center text-sm text-[color:var(--muted)]">
                  No matches. They'll need to join with the trip's invite code.
                </p>
              )}
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Back
              </button>
              <button type="button" onClick={handleCreate} className="btn-gold px-4 py-2 text-sm">
                Create trip{selected.length > 0 ? ` with ${selected.length}` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[color:var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
