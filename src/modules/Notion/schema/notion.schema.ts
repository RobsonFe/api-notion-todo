import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notion extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    priority: string;

    @Prop()
    notionPageId: string;
}

export const NotionSchema = SchemaFactory.createForClass(Notion);
