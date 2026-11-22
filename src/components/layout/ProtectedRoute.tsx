import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

/**
 * UX-only guard. The real security boundary is RLS (Section 5 of the spec).
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[color:var(--muted)]">
        Loading…
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;

  return <>{children}</>;
}
