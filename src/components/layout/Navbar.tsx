import { NavLink, Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/active-trips', label: 'Active Trips' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--edge)] bg-[color:var(--bg)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="font-display text-lg font-bold tracking-tight">
          Fair<span className="text-[color:var(--gold)]">Share</span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[color:var(--surface-2)] text-[color:var(--cream)]'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--cream)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </nav>

      <div className="flex gap-1 border-t border-[color:var(--edge)] px-4 py-2 sm:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-xs ${
                isActive
                  ? 'bg-[color:var(--surface-2)] text-[color:var(--cream)]'
                  : 'text-[color:var(--muted)]'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
