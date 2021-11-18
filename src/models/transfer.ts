import mongoose, {
  Document, model, Model, Schema,
} from 'mongoose';

export interface Transfer {
  accountID: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  note: string;
  labelsID: mongoose.Types.ObjectId[];
  counterparty?: string;
}

export type TransferModel = Model<Transfer, {}, {}>;

export const transferSchema = new Schema<Transfer, TransferModel>({
  accountID: { type: mongoose.SchemaTypes.ObjectId, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  note: { type: String, trim: true },
  labelsID: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  counterparty: { type: String, trim: true },
}, {
  versionKey: false,
});

export const transferModel = model<Transfer, TransferModel, {}>('transfer', transferSchema);

export type TransferDocument = Transfer & Document<mongoose.Types.ObjectId, {}, {}>;
