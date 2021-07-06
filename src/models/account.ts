import { Schema } from 'mongoose';

export interface Account {
  name: string;
}

export function isAccount(val: any): val is Account {
  return (
    val !== null
    && typeof val === 'object'
    && typeof val.name === 'string'
  );
}

export const accountSchema = new Schema({
  name: String,
});
