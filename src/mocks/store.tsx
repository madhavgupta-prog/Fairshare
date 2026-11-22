import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Expense, Profile, SplitType, Trip, TripStatus } from '../lib/types';
import { profiles as seedProfiles } from './profiles';
import { trips as seedTrips } from './trips';

/**
 * In-memory stand-in for the Supabase queries in Section 6 of the spec.
 * Every mutation here maps 1:1 to a `supabase.from(...)` call, so swapping this
 * provider for real client calls later is a contained change.
 */

let counter = 0;
const uid = (prefix: string) => `${prefix}-local-${(counter += 1)}`;

export interface NewExpenseInput {
  tripId: string;
  description: string;
  amount: number;
  splitType: SplitType;
  payers: { userId: string; amount: number }[];
  splits: { userId: string; amount: number }[];
  createdBy: string;
}

export interface NewTripInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  memberIds: string[];
  createdBy: string;
}

interface TripDataValue {
  trips: Trip[];
  people: Profile[];
  getTrip: (tripId: string) => Trip | undefined;
  addExpense: (input: NewExpenseInput) => void;
  createTrip: (input: NewTripInput) => Trip;
  recordSettlement: (tripId: string, from: string, to: string, amount: number) => void;
  setTripStatus: (tripId: string, status: TripStatus) => void;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
}

const TripDataContext = createContext<TripDataValue | undefined>(undefined);

function randomInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function TripDataProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(seedTrips);
  const [people, setPeople] = useState<Profile[]>(seedProfiles);

  const getTrip = useCallback((tripId: string) => trips.find((t) => t.id === tripId), [trips]);

  const addExpense = useCallback((input: NewExpenseInput) => {
    const expenseId = uid('exp');
    const expense: Expense = {
      id: expenseId,
      trip_id: input.tripId,
      description: input.description,
      amount: input.amount,
      split_type: input.splitType,
      created_by: input.createdBy,
      created_at: new Date().toISOString(),
      expense_payers: input.payers.map((p) => ({
        id: uid('pay'),
        expense_id: expenseId,
        user_id: p.userId,
        amount_paid: p.amount,
      })),
      expense_splits: input.splits.map((s) => ({
        id: uid('spl'),
        expense_id: expenseId,
        user_id: s.userId,
        amount_owed: s.amount,
      })),
    };

    setTrips((prev) =>
      prev.map((t) =>
        t.id === input.tripId
          ? { ...t, expenses: [...t.expenses, expense], status: t.status === 'draft' ? 'active' : t.status }
          : t,
      ),
    );
  }, []);

  const createTrip = useCallback(
    (input: NewTripInput) => {
      const tripId = uid('trip');
      const createdAt = new Date().toISOString();
      const memberIds = Array.from(new Set([input.createdBy, ...input.memberIds]));
      const trip: Trip = {
        id: tripId,
        name: input.name,
        description: input.description || null,
        start_date: input.startDate || null,
        end_date: input.endDate || null,
        invite_code: randomInviteCode(),
        status: 'active',
        created_by: input.createdBy,
        created_at: createdAt,
        trip_members: memberIds.map((userId) => ({
          id: uid('tm'),
          trip_id: tripId,
          user_id: userId,
          joined_at: createdAt,
          profiles: people.find((p) => p.id === userId)!,
        })),
        expenses: [],
        settlements: [],
      };
      setTrips((prev) => [trip, ...prev]);
      return trip;
    },
    [people],
  );

  const recordSettlement = useCallback(
    (tripId: string, from: string, to: string, amount: number) => {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === tripId
            ? {
                ...t,
                settlements: [
                  ...t.settlements,
                  {
                    id: uid('set'),
                    trip_id: tripId,
                    from_user: from,
                    to_user: to,
                    amount,
                    settled_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                  },
                ],
              }
            : t,
        ),
      );
    },
    [],
  );

  const setTripStatus = useCallback((tripId: string, status: TripStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status } : t)));
  }, []);

  const updateProfile = useCallback((id: string, patch: Partial<Profile>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setTrips((prev) =>
      prev.map((t) => ({
        ...t,
        trip_members: t.trip_members.map((m) =>
          m.user_id === id ? { ...m, profiles: { ...m.profiles, ...patch } } : m,
        ),
      })),
    );
  }, []);

  const value = useMemo(
    () => ({
      trips,
      people,
      getTrip,
      addExpense,
      createTrip,
      recordSettlement,
      setTripStatus,
      updateProfile,
    }),
    [trips, people, getTrip, addExpense, createTrip, recordSettlement, setTripStatus, updateProfile],
  );

  return <TripDataContext.Provider value={value}>{children}</TripDataContext.Provider>;
}

export function useTripData(): TripDataValue {
  const ctx = useContext(TripDataContext);
  if (!ctx) throw new Error('useTripData must be used inside <TripDataProvider>');
  return ctx;
}
