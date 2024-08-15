import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class TextAnnotations {
    @Prop()
    bold?: boolean;

    @Prop()
    italic?: boolean;

    @Prop()
    strikethrough?: boolean;

    @Prop()
    underline?: boolean;

    @Prop()
    code?: boolean;

    @Prop()
    color?: string;
}

class TextContent {
    @Prop()
    content?: string;

    @Prop()
    link?: string | null;
}

class TitleText {
    @Prop()
    type?: string;

    @Prop({ type: TextContent })
    text?: TextContent;

    @Prop({ type: TextAnnotations })
    annotations?: TextAnnotations;

    @Prop()
    plain_text?: string;

    @Prop()
    href?: string | null;
}

class Select {
    @Prop()
    id?: string;

    @Prop()
    name?: string;

    @Prop()
    color?: string;
}

class Status {
    @Prop()
    id?: string;

    @Prop()
    name?: string;

    @Prop()
    color?: string;
}

class Tarefa {
    @Prop()
    id?: string;

    @Prop()
    type?: string;

    @Prop({ type: [TitleText] })
    title?: TitleText[];
}

class Properties {
    @Prop({ type: Select })
    Prioridade?: Select;

    @Prop({ type: Status })
    Status?: Status;

    @Prop({ type: Tarefa })
    Tarefa?: Tarefa;
}

@Schema({ timestamps: true })
export class Notion extends Document {
    @Prop()
    id?: string;

    @Prop({ type: Properties })
    properties?: Properties;
}

export const NotionSchema = SchemaFactory.createForClass(Notion);
