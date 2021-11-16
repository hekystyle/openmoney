import { Transaction } from '../../models/transaction';

export type ImportResult = Array<{
  errors: Array<{ message: string }>;
  raw: Record<string, string>;
  imported?: Transaction;
}>;
