import mongoose, { Schema, type Document } from 'mongoose';

export type IncidentStatus =
  | 'PENDING_EVIDENCE'
  | 'EVIDENCE_VALIDATED'
  | 'AWAITING_CONFIRMATION'
  | 'COORDINATOR_REVIEW'
  | 'VERIFIED'
  | 'FALSE_REPORT'
  | 'ALLOCATING'
  | 'ASSIGNMENT_PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED';

export type IncidentVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'FALSE_REPORT' | 'PENDING_REVIEW';

export interface IIncident extends Document {
  reporterId: mongoose.Types.ObjectId;
  incidentType: string;
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  severity: 'Low' | 'Medium' | 'High';
  priority?: string;
  requiredSkills: string[];
  evidenceIds: mongoose.Types.ObjectId[];
  status: IncidentStatus;
  verificationStatus: IncidentVerificationStatus;
  verificationMethod?: 'CONFIRMATION' | 'COORDINATOR_REVIEW' | 'MANUAL';
  reportedAt: Date;
  verifiedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const incidentSchema = new Schema<IIncident>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    incidentType: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true }
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    priority: { type: String, trim: true },
    requiredSkills: { type: [String], default: [] },
    evidenceIds: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
    status: {
      type: String,
      enum: ['PENDING_EVIDENCE', 'EVIDENCE_VALIDATED', 'AWAITING_CONFIRMATION', 'COORDINATOR_REVIEW', 'VERIFIED', 'FALSE_REPORT', 'ALLOCATING', 'ASSIGNMENT_PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING_EVIDENCE'
    },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'VERIFIED', 'FALSE_REPORT', 'PENDING_REVIEW'],
      default: 'UNVERIFIED'
    },
    verificationMethod: {
      type: String,
      enum: ['CONFIRMATION', 'COORDINATOR_REVIEW', 'MANUAL'],
      default: 'CONFIRMATION'
    },
    reportedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

incidentSchema.index({ reporterId: 1, createdAt: -1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ verificationStatus: 1 });
incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ createdAt: -1 });

export const Incident = mongoose.model<IIncident>('Incident', incidentSchema);
