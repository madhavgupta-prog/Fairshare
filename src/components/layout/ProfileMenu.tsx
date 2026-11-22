import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Avatar from './Avatar';

export default function ProfileMenu() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!profile) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[color:var(--edge)] py-1 pr-3 pl-1 text-sm hover:bg-[color:var(--surface-2)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={profile.name} url={profile.avatar_url} size={26} />
        <span className="hidden sm:inline">{profile.name.split(' ')[0]}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="card absolute right-0 z-30 mt-2 w-48 overflow-hidden p-1 text-sm"
        >
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 hover:bg-[color:var(--surface-2)]"
          >
            Profile
          </Link>
          <Link
            to="/history"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 hover:bg-[color:var(--surface-2)]"
          >
            Trip history
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
              navigate('/');
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-[color:var(--coral)] hover:bg-[color:var(--surface-2)]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
