import { model, Schema } from 'mongoose';
import { User as IUser, UserModel } from './user.types';

export const userSchema = new Schema({
  email: {
    type: String, unique: true, required: true, trim: true,
  },
  passwordHash: { type: String, required: false },
}, {
  versionKey: false,
});

export const User = model<IUser, UserModel>('user', userSchema);
