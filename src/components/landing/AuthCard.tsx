import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export default function AuthCard() {
  const { signInWithGoogle, mockMode, session } = useAuth();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      if (mockMode) navigate('/dashboard');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-sm rounded-2xl p-6">
      <h2 className="font-display text-xl font-semibold">
        {session ? 'Welcome back' : 'Split trip costs, fairly'}
      </h2>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Track who paid what across every trip, and settle up in the fewest possible payments.
      </p>

      {session ? (
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn-gold mt-5 w-full px-4 py-2.5 text-sm"
        >
          Go to dashboard
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="btn-gold mt-5 flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm"
        >
          <span aria-hidden>G</span>
          {busy ? 'Signing in…' : 'Continue with Google'}
        </button>
      )}

      {mockMode && (
        <p className="mt-3 text-center text-xs text-[color:var(--muted)]">
          Demo mode — no Supabase keys set, signing in loads sample data.
        </p>
      )}
    </div>
  );
}
