import mongoose, { Schema, type Document } from 'mongoose';

export type VerificationDecision = 'VERIFIED' | 'FALSE_REPORT' | 'PENDING';
export type ConfirmationResponse = 'CONFIRMED' | 'DENIED' | 'UNABLE_TO_CONFIRM';
export type ConfirmationSource = 'PLATFORM_USER' | 'NEARBY_LOCAL_USER' | 'NEARBY_VOLUNTEER';

export interface IVerificationRecord extends Document {
  incidentId: mongoose.Types.ObjectId;
  sourceType: ConfirmationSource | 'COORDINATOR';
  confirmingUserId?: mongoose.Types.ObjectId;
  coordinatorId?: mongoose.Types.ObjectId;
  decision?: VerificationDecision;
  notes?: string;
  callStatus?: 'REQUESTED' | 'COMPLETED' | 'FAILED' | 'MANUAL';
  verificationCallRequested?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const verificationRecordSchema = new Schema<IVerificationRecord>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true },
    sourceType: { type: String, enum: ['PLATFORM_USER', 'NEARBY_LOCAL_USER', 'NEARBY_VOLUNTEER', 'COORDINATOR'], required: true },
    confirmingUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    coordinatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    decision: {
      type: String,
      enum: ['VERIFIED', 'FALSE_REPORT', 'PENDING'],
      default: 'PENDING'
    },
    notes: { type: String, trim: true },
    callStatus: {
      type: String,
      enum: ['REQUESTED', 'COMPLETED', 'FAILED', 'MANUAL'],
      default: 'MANUAL'
    },
    verificationCallRequested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

verificationRecordSchema.index({ incidentId: 1, createdAt: -1 });
verificationRecordSchema.index({ confirmingUserId: 1, incidentId: 1 }, { unique: false });

export const VerificationRecord = mongoose.model<IVerificationRecord>('VerificationRecord', verificationRecordSchema);
