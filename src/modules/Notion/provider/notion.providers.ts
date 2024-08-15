import { Mongoose } from 'mongoose';
import { NotionSchema } from '../schema/notion.schema';

export const NotionProviders = [
    {
        provide: 'NOTION_SCHEMA',
        useFactory: (mongoose: Mongoose) =>
            mongoose.model('Notion', NotionSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
