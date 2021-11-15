import { Model, Schema } from 'mongoose';

export interface Account {
  name: string;
  balance: number;
  currency: string;
}

export const accountSchema = new Schema<Account>({
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
});

export type AccountModel = Model<Account>;
