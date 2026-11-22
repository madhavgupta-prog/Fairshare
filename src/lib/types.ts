export type ThemeName = 'dark' | 'light';

export type TripStatus = 'draft' | 'active' | 'settled';

export type SplitType = 'equal' | 'custom';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  upi_id: string | null;
  theme: ThemeName;
  created_at: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  joined_at: string;
  profiles: Profile;
}

export interface ExpensePayer {
  id: string;
  expense_id: string;
  user_id: string;
  amount_paid: number;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount_owed: number;
}

export interface Expense {
  id: string;
  trip_id: string;
  description: string;
  amount: number;
  split_type: SplitType;
  created_by: string;
  created_at: string;
  expense_payers: ExpensePayer[];
  expense_splits: ExpenseSplit[];
}

export interface Settlement {
  id: string;
  trip_id: string;
  from_user: string;
  to_user: string;
  amount: number;
  settled_at: string | null;
  created_at: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  invite_code: string;
  status: TripStatus;
  created_by: string;
  created_at: string;
  trip_members: TripMember[];
  expenses: Expense[];
  settlements: Settlement[];
}

/** A single suggested payment produced by computeSettlements. */
export interface SettlementTxn {
  from: string;
  to: string;
  amount: number;
}
