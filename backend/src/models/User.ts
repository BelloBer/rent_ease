import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase UID
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const userSchema: Schema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', userSchema);
