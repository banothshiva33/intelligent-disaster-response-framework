import mongoose, { Schema, type Document } from 'mongoose';

export interface IEvidence extends Document {
  incidentId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  validationStatus: 'PENDING' | 'VALID' | 'REJECTED';
  metadata?: Record<string, unknown>;
  uploadedAt: Date;
}

const evidenceSchema = new Schema<IEvidence>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    validationStatus: {
      type: String,
      enum: ['PENDING', 'VALID', 'REJECTED'],
      default: 'PENDING'
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

evidenceSchema.index({ incidentId: 1, uploadedAt: -1 });

evidenceSchema.index({ uploadedBy: 1 });

export const Evidence = mongoose.model<IEvidence>('Evidence', evidenceSchema);
