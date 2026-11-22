import type { Profile } from '../lib/types';

/** The signed-in user in mock mode. */
export const CURRENT_USER_ID = 'u-aarav';

export const profiles: Profile[] = [
  {
    id: CURRENT_USER_ID,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    avatar_url: null,
    upi_id: 'aarav@okhdfcbank',
    theme: 'dark',
    created_at: '2026-01-14T09:20:00Z',
  },
  {
    id: 'u-meera',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    avatar_url: null,
    upi_id: 'meera.iyer@okaxis',
    theme: 'dark',
    created_at: '2026-01-16T11:05:00Z',
  },
  {
    id: 'u-rohan',
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@example.com',
    avatar_url: null,
    upi_id: 'rohank@ybl',
    theme: 'dark',
    created_at: '2026-02-02T18:40:00Z',
  },
  {
    id: 'u-diya',
    name: 'Diya Nair',
    email: 'diya.nair@example.com',
    avatar_url: null,
    upi_id: null,
    theme: 'light',
    created_at: '2026-02-11T07:15:00Z',
  },
  {
    id: 'u-kabir',
    name: 'Kabir Singh',
    email: 'kabir.singh@example.com',
    avatar_url: null,
    upi_id: 'kabirs@oksbi',
    theme: 'dark',
    created_at: '2026-03-01T14:30:00Z',
  },
  {
    id: 'u-ananya',
    name: 'Ananya Bose',
    email: 'ananya.bose@example.com',
    avatar_url: null,
    upi_id: 'ananyab@upi',
    theme: 'dark',
    created_at: '2026-03-22T16:00:00Z',
  },
];

export const profileById = new Map(profiles.map((p) => [p.id, p]));

export function getProfile(id: string): Profile | undefined {
  return profileById.get(id);
}

export function profileName(id: string): string {
  return profileById.get(id)?.name ?? 'Unknown';
}
