import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import { CURRENT_USER_ID } from '../mocks/profiles';
import { useTripData } from '../mocks/store';

interface AuthValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  /** True while running against fixtures instead of a real Supabase project. */
  mockMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

const MOCK_SESSION_KEY = 'fairshare.mockSession';

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockMode = !isSupabaseConfigured;
  const { people, updateProfile: updateMockProfile } = useTripData();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!mockMode);
  const [mockSignedIn, setMockSignedIn] = useState(
    () => mockMode && localStorage.getItem(MOCK_SESSION_KEY) === '1',
  );

  useEffect(() => {
    if (mockMode) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => sub.subscription.unsubscribe();
  }, [mockMode]);

  // Section 8 — make sure a profile row exists on first login.
  useEffect(() => {
    if (mockMode || !session?.user) return;
    const user = session.user;

    let cancelled = false;
    (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (cancelled) return;

      if (data) {
        setProfile(data as Profile);
        return;
      }

      const row = {
        id: user.id,
        name: (user.user_metadata.full_name as string) ?? user.email ?? 'New user',
        email: user.email ?? '',
        avatar_url: (user.user_metadata.avatar_url as string) ?? null,
      };
      const { data: created } = await supabase.from('profiles').insert(row).select().single();
      if (!cancelled && created) setProfile(created as Profile);
    })();

    return () => {
      cancelled = true;
    };
  }, [mockMode, session]);

  const signInWithGoogle = useCallback(async () => {
    if (mockMode) {
      localStorage.setItem(MOCK_SESSION_KEY, '1');
      setMockSignedIn(true);
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }, [mockMode]);

  const signOut = useCallback(async () => {
    if (mockMode) {
      localStorage.removeItem(MOCK_SESSION_KEY);
      setMockSignedIn(false);
      return;
    }
    await supabase.auth.signOut();
    setProfile(null);
  }, [mockMode]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (mockMode) {
        updateMockProfile(CURRENT_USER_ID, patch);
        return;
      }
      if (!profile) return;
      const { data } = await supabase
        .from('profiles')
        .update(patch)
        .eq('id', profile.id)
        .select()
        .single();
      if (data) setProfile(data as Profile);
    },
    [mockMode, profile, updateMockProfile],
  );

  const value = useMemo<AuthValue>(() => {
    if (mockMode) {
      const mockProfile = people.find((p) => p.id === CURRENT_USER_ID) ?? null;
      return {
        // Enough of a Session for <ProtectedRoute> and the navbar to work.
        session: mockSignedIn ? ({ user: { id: CURRENT_USER_ID } } as unknown as Session) : null,
        profile: mockSignedIn ? mockProfile : null,
        loading: false,
        mockMode,
        signInWithGoogle,
        signOut,
        updateProfile,
      };
    }
    return { session, profile, loading, mockMode, signInWithGoogle, signOut, updateProfile };
  }, [
    mockMode,
    mockSignedIn,
    people,
    session,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
