import { Model, Schema } from 'mongoose';

export interface Account {
  name: string;
  balance: number;
  currency: string;
}

export function isAccount(val: any): val is Account {
  return (
    val !== null
    && typeof val === 'object'
    && typeof val.name === 'string'
  );
}

export const accountSchema = new Schema<Account>({
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
});

export type AccountModel = Model<Account>;
