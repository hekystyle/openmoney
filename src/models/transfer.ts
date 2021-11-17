import mongoose, {
  Document, model, Model, Schema,
} from 'mongoose';

export interface Transfer {
  accountID: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  currency: string;
  note: string;
  labels: mongoose.Types.ObjectId[];
}

export type TransferModel = Model<Transfer, {}, {}>;

export const transferSchema = new Schema<Transfer, TransferModel>({
  accountID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, uppercase: true },
  note: { type: String, trim: true },
  labels: { type: [mongoose.SchemaTypes.ObjectId], required: true },
}, {
  versionKey: false,
});

export const transferModel = model<Transfer, TransferModel, {}>('transaction', transferSchema);

export type TransferDocument = Transfer & Document<mongoose.Types.ObjectId, {}, {}>;
