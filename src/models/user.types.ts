import mongoose, { Document, Model } from 'mongoose';

export interface User {
  email: string;
  passwordHash: string;
}

export type UserModel = Model<User, {}, {}>;

export type UserDocument = User & Document<mongoose.Types.ObjectId, {}, {}>;
