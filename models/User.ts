// models/User.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string; // Password will be selected: false in schema
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true, select: false }, // Hide password by default
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Prevent model recompilation in Next.js dev mode
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;