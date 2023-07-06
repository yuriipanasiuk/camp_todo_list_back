import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Todo {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ default: false })
  isComplete: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: MongooseSchema.Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
