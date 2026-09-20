import mongoose, { Schema, type Document } from 'mongoose';

export interface IAuditRecord extends Document {
  actorId?: mongoose.Types.ObjectId;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId | string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const auditRecordSchema = new Schema<IAuditRecord>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String, trim: true },
    action: { type: String, required: true, trim: true },
    entityType: { type: String, trim: true },
    entityId: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, trim: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditRecordSchema.index({ actorId: 1, createdAt: -1 });
auditRecordSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AuditRecord = mongoose.model<IAuditRecord>('AuditRecord', auditRecordSchema);
