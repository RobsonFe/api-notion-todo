import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Select, Status, TitleText } from '../interface/tasks.interface';

@Schema({ timestamps: true })
export class Notion extends Document {
    @Prop({ required: true })
    id: string;

    @Prop({
        type: [
            {
                text: { content: String },
            },
        ],
    })
    tarefa: TitleText[];

    @Prop({
        type: {
            name: String,
        },
    })
    status: Status;

    @Prop({
        type: {
            name: String,
        },
    })
    prioridade: Select;
}

export const NotionSchema = SchemaFactory.createForClass(Notion);
