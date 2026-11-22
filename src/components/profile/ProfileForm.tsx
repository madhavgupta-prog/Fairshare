import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import Avatar from '../layout/Avatar';

export default function ProfileForm() {
  const { profile, updateProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(profile?.name ?? '');
  const [upiId, setUpiId] = useState(profile?.upi_id ?? '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: name.trim(), upi_id: upiId.trim() || null });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-xl space-y-5 p-6">
      <div className="flex items-center gap-4">
        <Avatar name={profile?.name ?? '?'} url={profile?.avatar_url} size={56} />
        <div className="min-w-0">
          <p className="font-display truncate text-lg font-semibold">{profile?.name}</p>
          <p className="truncate text-xs text-[color:var(--muted)]">{profile?.email}</p>
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs text-[color:var(--muted)]">Display name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs text-[color:var(--muted)]">UPI ID</span>
        <input
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="yourname@upi"
          className="input money"
        />
        <span className="mt-1.5 block text-[11px] text-[color:var(--muted)]">
          Used to generate payment links when friends settle up with you.
        </span>
      </label>

      <div>
        <span className="mb-2 block text-xs text-[color:var(--muted)]">Theme</span>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
                theme === t
                  ? 'border-[color:var(--gold)] bg-[color:var(--surface-2)] text-[color:var(--gold)]'
                  : 'border-[color:var(--edge)] text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-[color:var(--edge)] pt-5">
        <button type="submit" className="btn-gold px-5 py-2 text-sm">
          Save changes
        </button>
        {saved && <span className="text-xs text-[color:var(--teal)]">Saved</span>}
        <button
          type="button"
          onClick={signOut}
          className="btn-ghost ml-auto px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </div>
    </form>
  );
}
