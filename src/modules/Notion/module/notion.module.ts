import { NotionController } from '../controller/notion.controller';
import { NotionService } from '../service/notion.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [NotionController],
    providers: [NotionService],
})
export class NotionModule {}
