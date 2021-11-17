import mongoose, {
  Document, model, Model, Schema,
} from 'mongoose';

export interface Transfer {
  sourceAccountID: mongoose.Types.ObjectId;
  targetAccountID: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  note: string;
  labels: mongoose.Types.ObjectId[];
}

export type TransferModel = Model<Transfer, {}, {}>;

export const transferSchema = new Schema<Transfer, TransferModel>({
  sourceAccountID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  targetAccountID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  labels: { type: [mongoose.SchemaTypes.ObjectId], required: true },
}, {
  versionKey: false,
});

export const transferModel = model<Transfer, TransferModel, {}>('transaction', transferSchema);

export type TransferDocument = Transfer & Document<mongoose.Types.ObjectId, {}, {}>;
