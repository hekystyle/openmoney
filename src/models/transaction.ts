import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Transaction {
  accountID: mongoose.Types.ObjectId;
  categoryID: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  note: string;
  labels: mongoose.Types.ObjectId[];
  counterparty: string;
  monthsCountOfWarranty: number;
}

export const transactionSchema = new Schema<Transaction>({
  accountID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  categoryID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  labels: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  counterparty: { type: String },
  monthsCountOfWarranty: { type: Number, required: true },
}, {
  versionKey: false,
});

export type TransactionModel = Model<Transaction>;

export type TransactionDocument = Transaction & Document<mongoose.Types.ObjectId, {}, {}>;
