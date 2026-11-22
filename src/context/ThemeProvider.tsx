import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThemeName } from '../lib/types';

interface ThemeValue {
  theme: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

const STORAGE_KEY = 'fairshare.theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeName) ?? 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
