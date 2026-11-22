import type { Trip } from '../lib/types';
import { makeTrip } from './factory';
import { CURRENT_USER_ID } from './profiles';

const AARAV = CURRENT_USER_ID;
const MEERA = 'u-meera';
const ROHAN = 'u-rohan';
const DIYA = 'u-diya';
const KABIR = 'u-kabir';
const ANANYA = 'u-ananya';

export const trips: Trip[] = [
  makeTrip({
    id: 'trip-manali',
    name: 'Manali Winter Escape',
    description: 'Six days of snow, sulphur springs and questionable driving.',
    start_date: '2026-08-02',
    end_date: '2026-08-09',
    invite_code: 'MNL7X2',
    status: 'active',
    created_by: AARAV,
    created_at: '2026-07-20T10:00:00Z',
    memberIds: [AARAV, MEERA, ROHAN, DIYA, KABIR],
    expenses: [
      {
        description: 'Volvo tickets Delhi → Manali',
        amount: 14500,
        paidBy: AARAV,
        createdAt: '2026-08-02T05:30:00Z',
      },
      {
        description: 'Homestay in Old Manali (3 nights)',
        amount: 21000,
        paidBy: MEERA,
        createdAt: '2026-08-02T16:10:00Z',
      },
      {
        description: 'Groceries and breakfast supplies',
        amount: 3240,
        paidBy: { [ROHAN]: 2000, [DIYA]: 1240 },
        createdAt: '2026-08-03T09:45:00Z',
      },
      {
        description: 'Solang Valley paragliding',
        amount: 12000,
        paidBy: KABIR,
        sharedBy: [AARAV, ROHAN, KABIR, DIYA],
        createdAt: '2026-08-04T12:20:00Z',
      },
      {
        description: 'Cab to Kasol day trip',
        amount: 6800,
        paidBy: AARAV,
        createdAt: '2026-08-05T07:00:00Z',
      },
      {
        description: 'Dinner at Café 1947',
        amount: 4650,
        paidBy: DIYA,
        createdAt: '2026-08-05T20:30:00Z',
      },
      {
        description: 'Snow gear rental',
        amount: 2800,
        paidBy: MEERA,
        customSplit: { [AARAV]: 900, [MEERA]: 600, [ROHAN]: 700, [KABIR]: 600 },
        createdAt: '2026-08-06T10:15:00Z',
      },
    ],
  }),

  makeTrip({
    id: 'trip-goa',
    name: 'Goa Beach Week',
    description: 'North Goa, one scooter short of a disaster.',
    start_date: '2026-07-11',
    end_date: '2026-07-17',
    invite_code: 'GOA4KP',
    status: 'active',
    created_by: MEERA,
    created_at: '2026-06-28T13:00:00Z',
    memberIds: [AARAV, MEERA, ANANYA, KABIR],
    expenses: [
      {
        description: 'Flights Mumbai → Goa',
        amount: 18400,
        paidBy: MEERA,
        createdAt: '2026-07-11T06:00:00Z',
      },
      {
        description: 'Beach villa in Anjuna (5 nights)',
        amount: 32500,
        paidBy: ANANYA,
        createdAt: '2026-07-11T15:40:00Z',
      },
      {
        description: 'Scooter rentals',
        amount: 4200,
        paidBy: KABIR,
        createdAt: '2026-07-12T09:00:00Z',
      },
      {
        description: 'Sunday brunch at Baga',
        amount: 5600,
        paidBy: ANANYA,
        sharedBy: [AARAV, MEERA, ANANYA],
        createdAt: '2026-07-14T11:30:00Z',
      },
      {
        description: 'Dudhsagar waterfall tour',
        amount: 9200,
        paidBy: MEERA,
        createdAt: '2026-07-15T08:20:00Z',
      },
    ],
    settlements: [
      { from: KABIR, to: MEERA, amount: 3000, settled_at: '2026-07-18T10:00:00Z' },
    ],
  }),

  makeTrip({
    id: 'trip-rishikesh',
    name: 'Rishikesh Rafting',
    description: 'Long weekend on the Ganga.',
    start_date: '2026-08-21',
    end_date: '2026-08-24',
    invite_code: 'RSH9QW',
    status: 'draft',
    created_by: AARAV,
    created_at: '2026-08-06T19:30:00Z',
    memberIds: [AARAV, ROHAN, DIYA],
    expenses: [
      {
        description: 'Camp booking advance',
        amount: 7500,
        paidBy: AARAV,
        createdAt: '2026-08-07T11:00:00Z',
      },
    ],
  }),

  makeTrip({
    id: 'trip-jaipur',
    name: 'Jaipur Heritage Run',
    description: 'Forts, thalis and a lot of walking.',
    start_date: '2026-04-04',
    end_date: '2026-04-08',
    invite_code: 'JPR2MT',
    status: 'settled',
    created_by: ROHAN,
    created_at: '2026-03-20T08:00:00Z',
    memberIds: [AARAV, ROHAN, MEERA, ANANYA],
    expenses: [
      {
        description: 'Train tickets',
        amount: 8600,
        paidBy: ROHAN,
        createdAt: '2026-04-04T06:15:00Z',
      },
      {
        description: 'Haveli stay (4 nights)',
        amount: 24000,
        paidBy: AARAV,
        createdAt: '2026-04-04T14:00:00Z',
      },
      {
        description: 'Amber Fort tickets and guide',
        amount: 5200,
        paidBy: MEERA,
        createdAt: '2026-04-05T10:30:00Z',
      },
      {
        description: 'Farewell dinner',
        amount: 6400,
        paidBy: ANANYA,
        createdAt: '2026-04-07T21:00:00Z',
      },
    ],
    settlements: [
      { from: MEERA, to: AARAV, amount: 5850, settled_at: '2026-04-09T09:00:00Z' },
      { from: ANANYA, to: AARAV, amount: 4650, settled_at: '2026-04-09T09:20:00Z' },
      { from: ROHAN, to: AARAV, amount: 2450, settled_at: '2026-04-10T18:00:00Z' },
    ],
  }),

  makeTrip({
    id: 'trip-kasol',
    name: 'Kasol Backpacking',
    description: 'Tents, trails and terrible network.',
    start_date: '2026-02-13',
    end_date: '2026-02-16',
    invite_code: 'KSL5RD',
    status: 'settled',
    created_by: KABIR,
    created_at: '2026-02-01T12:00:00Z',
    memberIds: [AARAV, KABIR, DIYA],
    expenses: [
      {
        description: 'Fuel and tolls',
        amount: 5400,
        paidBy: KABIR,
        createdAt: '2026-02-13T07:00:00Z',
      },
      {
        description: 'Hostel bunks',
        amount: 4500,
        paidBy: DIYA,
        createdAt: '2026-02-13T18:30:00Z',
      },
      {
        description: 'Trek guide to Kheerganga',
        amount: 3600,
        paidBy: AARAV,
        createdAt: '2026-02-14T08:00:00Z',
      },
    ],
    settlements: [
      { from: AARAV, to: KABIR, amount: 900, settled_at: '2026-02-17T11:00:00Z' },
    ],
  }),
];

export const tripById = new Map(trips.map((t) => [t.id, t]));

export const activeTrips = trips.filter((t) => t.status !== 'settled');
export const settledTrips = trips.filter((t) => t.status === 'settled');
