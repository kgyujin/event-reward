import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  eventId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  rewardId: Types.ObjectId;

  @Prop({ default: 'PENDING', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Prop()
  message?: string;

  @Prop()
  grantedAt?: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);