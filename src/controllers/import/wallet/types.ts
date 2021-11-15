import { WALLET_CSV_HEADERS } from './constants';

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};

export type ImportingWalletRecord = ObjectFromList<typeof WALLET_CSV_HEADERS>;

export enum WalletRecordType {
  Income = 'Income',
  Expenses = 'Expenses',
}

export interface ParsedWalletRecord {
  accountName: string;
  categoryName: string;
  currency: string;
  amount: number;
  type: WalletRecordType;
  note: string;
  date: Date;
  monthsCountOfWarranty: number;
  isTransfer: boolean;
  payee: string;
  labels: string[];
}
