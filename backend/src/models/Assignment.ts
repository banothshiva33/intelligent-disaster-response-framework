import mongoose, { Schema, type Document } from 'mongoose';

export type AssignmentStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface IAssignment extends Document {
  incidentId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status: AssignmentStatus;
  message?: string;
  acceptedAt?: Date;
  declinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    message: { type: String, trim: true },
    acceptedAt: { type: Date },
    declinedAt: { type: Date }
  },
  { timestamps: true }
);

assignmentSchema.index({ incidentId: 1, status: 1 });
assignmentSchema.index({ volunteerId: 1, status: 1 });
assignmentSchema.index({ assignedBy: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
