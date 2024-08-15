import { Mongoose } from 'mongoose';
import { NotionSchema } from '../schema/notion.schema';

export const Notion = [
    {
        provide: 'NOTION_SCHEMA',
        useFactory: (mongoose: Mongoose) =>
            mongoose.model('Notion', NotionSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
