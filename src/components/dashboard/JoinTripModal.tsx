import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripData } from '../../mocks/store';

export default function JoinTripModal({ onClose }: { onClose: () => void }) {
  const { trips } = useTripData();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoin = () => {
    const match = trips.find((t) => t.invite_code.toLowerCase() === code.trim().toLowerCase());
    if (!match) {
      setError('No trip found for that code.');
      return;
    }
    onClose();
    navigate(`/trip/${match.id}`);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-sm p-6">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-xl font-semibold">Join a trip</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[color:var(--muted)] hover:text-[color:var(--cream)]"
          >
            ✕
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-xs text-[color:var(--muted)]">Invite code</span>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="MNL7X2"
            className="input money tracking-widest uppercase"
          />
        </label>

        {error && <p className="mt-2 text-xs text-[color:var(--coral)]">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            disabled={code.trim().length === 0}
            className="btn-gold px-4 py-2 text-sm"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
