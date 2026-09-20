import mongoose, { Schema, type Document } from 'mongoose';

export type VolunteerAvailability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface IVolunteer extends Document {
  userId: mongoose.Types.ObjectId;
  skills: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  availability: VolunteerAvailability;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  currentAssignmentId?: mongoose.Types.ObjectId;
  experience?: number;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: { type: [String], default: [] },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: { type: [Number] }
    },
    availability: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE'
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    currentAssignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    experience: { type: Number, default: 0 }
  },
  { timestamps: true }
);

volunteerSchema.index({ location: '2dsphere' });
volunteerSchema.index({ availability: 1 });
volunteerSchema.index({ skills: 1 });

export const Volunteer = mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
