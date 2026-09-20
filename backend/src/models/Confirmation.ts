import mongoose, { Schema, type Document } from 'mongoose';

export type ConfirmationResponse = 'CONFIRMED' | 'DENIED' | 'UNABLE_TO_CONFIRM';
export type ConfirmationSource = 'PLATFORM_USER' | 'NEARBY_LOCAL_USER' | 'NEARBY_VOLUNTEER';

export interface IConfirmation extends Document {
  incidentId: mongoose.Types.ObjectId;
  confirmingUserId: mongoose.Types.ObjectId;
  sourceType: ConfirmationSource;
  response: ConfirmationResponse;
  comment?: string;
  locationAtConfirmation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: Date;
}

const confirmationSchema = new Schema<IConfirmation>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true },
    confirmingUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sourceType: {
      type: String,
      enum: ['PLATFORM_USER', 'NEARBY_LOCAL_USER', 'NEARBY_VOLUNTEER'],
      required: true
    },
    response: {
      type: String,
      enum: ['CONFIRMED', 'DENIED', 'UNABLE_TO_CONFIRM'],
      required: true
    },
    comment: { type: String, trim: true },
locationAtConfirmation: {
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number],
    validate: {
      validator: (value: number[]) =>
        Array.isArray(value) &&
        value.length === 2 &&
        value.every(Number.isFinite),
      message:
        'Confirmation coordinates must contain longitude and latitude.'
    }
  }
}
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

confirmationSchema.index({ incidentId: 1, confirmingUserId: 1 }, { unique: true });
confirmationSchema.index({ incidentId: 1, createdAt: -1 });
confirmationSchema.index({ locationAtConfirmation: '2dsphere' });

export const Confirmation = mongoose.model<IConfirmation>('Confirmation', confirmationSchema);
