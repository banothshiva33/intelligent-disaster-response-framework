import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole =
  | 'CITIZEN'
  | 'VOLUNTEER'
  | 'COORDINATOR'
  | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  isFlagged: boolean;
  trustScore: number;

  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['CITIZEN', 'VOLUNTEER', 'COORDINATOR', 'ADMIN'],
      default: 'CITIZEN'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isFlagged: {
      type: Boolean,
      default: false
    },

    trustScore: {
      type: Number,
      default: 0
    },

    // Optional GeoJSON location.
    // A user can register without providing a location.
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ location: '2dsphere' });

export const User = mongoose.model<IUser>('User', userSchema);