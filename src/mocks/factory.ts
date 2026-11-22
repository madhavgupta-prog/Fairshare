import type { Expense, Trip, TripMember, TripStatus } from '../lib/types';
import { equalSplit } from '../lib/validation';
import { getProfile } from './profiles';

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${(seq += 1)}`;

export function makeMembers(tripId: string, userIds: string[], joinedAt: string): TripMember[] {
  return userIds.map((userId) => ({
    id: nextId('tm'),
    trip_id: tripId,
    user_id: userId,
    joined_at: joinedAt,
    profiles: getProfile(userId)!,
  }));
}

export interface ExpenseSeed {
  description: string;
  amount: number;
  /** Who actually paid. A single id means they paid the whole amount. */
  paidBy: string | Record<string, number>;
  /** Who shares the cost. Defaults to every trip member, split equally. */
  sharedBy?: string[];
  /** Explicit per-person amounts for a custom split. */
  customSplit?: Record<string, number>;
  createdAt: string;
}

export function makeExpense(
  tripId: string,
  memberIds: string[],
  seed: ExpenseSeed,
): Expense {
  const expenseId = nextId('exp');

  const payerMap =
    typeof seed.paidBy === 'string' ? { [seed.paidBy]: seed.amount } : seed.paidBy;

  const sharers = seed.customSplit
    ? Object.keys(seed.customSplit)
    : (seed.sharedBy ?? memberIds);

  const splitAmounts = seed.customSplit
    ? sharers.map((id) => seed.customSplit![id])
    : equalSplit(seed.amount, sharers.length);

  return {
    id: expenseId,
    trip_id: tripId,
    description: seed.description,
    amount: seed.amount,
    split_type: seed.customSplit ? 'custom' : 'equal',
    created_by: Object.keys(payerMap)[0],
    created_at: seed.createdAt,
    expense_payers: Object.entries(payerMap).map(([userId, amount]) => ({
      id: nextId('pay'),
      expense_id: expenseId,
      user_id: userId,
      amount_paid: amount,
    })),
    expense_splits: sharers.map((userId, i) => ({
      id: nextId('spl'),
      expense_id: expenseId,
      user_id: userId,
      amount_owed: splitAmounts[i],
    })),
  };
}

export interface TripSeed {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  invite_code: string;
  status: TripStatus;
  created_by: string;
  created_at: string;
  memberIds: string[];
  expenses: ExpenseSeed[];
  settlements?: { from: string; to: string; amount: number; settled_at: string | null }[];
}

export function makeTrip(seed: TripSeed): Trip {
  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    start_date: seed.start_date,
    end_date: seed.end_date,
    invite_code: seed.invite_code,
    status: seed.status,
    created_by: seed.created_by,
    created_at: seed.created_at,
    trip_members: makeMembers(seed.id, seed.memberIds, seed.created_at),
    expenses: seed.expenses.map((e) => makeExpense(seed.id, seed.memberIds, e)),
    settlements: (seed.settlements ?? []).map((s) => ({
      id: nextId('set'),
      trip_id: seed.id,
      from_user: s.from,
      to_user: s.to,
      amount: s.amount,
      settled_at: s.settled_at,
      created_at: seed.created_at,
    })),
  };
}
