import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  type: 'SIGNUP' | 'LOGIN';

  @Prop({ required: true })
  email: string;

  @Prop()
  userId?: string;

  @Prop()
  status: 'SUCCESS' | 'FAIL';

  @Prop()
  message?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);