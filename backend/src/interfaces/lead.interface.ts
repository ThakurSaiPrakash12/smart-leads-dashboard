import { Types } from 'mongoose';
import { LeadStatus, LeadSource } from '../constants/enums';

export interface ILead {
  readonly _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
