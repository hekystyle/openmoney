import { Model, Schema } from 'mongoose';

export interface Label {
  name: string;
}

export const labelSchema = new Schema<Label>({
  name: { type: String, required: true },
});

export type LabelModel = Model<Label>;
