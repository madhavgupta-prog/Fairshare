import { createClient } from '@supabase/supabase-js';

// Placeholder values live in .env.local until the real Supabase project exists.
// Falling back to empty strings would make createClient throw at import time and
// take the whole app down, so we guard and expose a flag the UI can read.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(url && anonKey) &&
  !url.includes('your-project-ref') &&
  anonKey !== 'your-anon-key';

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
);
