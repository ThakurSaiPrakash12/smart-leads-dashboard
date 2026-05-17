import { Schema, model, Model } from 'mongoose';
import { ILead } from '../interfaces';
import { LeadStatus, LeadSource } from '../constants/enums';

type LeadModel = Model<ILead>;

const leadSchema = new Schema<ILead, LeadModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = model<ILead, LeadModel>('Lead', leadSchema);
