import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notion } from '../schema/notion.schema';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';

@Injectable()
export class NotionRepository {
    constructor(@Inject('NOTION_SCHEMA') private notionModel: Model<Notion>) {}

    async createTask(createTaskDto: CreateTaskDto): Promise<Notion> {
        const createTask = new this.notionModel(createTaskDto);
        return createTask.save();
    }
}
