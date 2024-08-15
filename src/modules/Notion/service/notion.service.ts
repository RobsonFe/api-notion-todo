import { Inject, Injectable } from '@nestjs/common';
import { NotionRepository } from '../repository/notion.repository';
import { Model } from 'mongoose';
import { Notion } from '../schema/notion.schema';
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';
dotenv.config();

@Injectable()
export class NotionService {
    private notion: Client;

    constructor(
        private readonly notionRepository: NotionRepository,
        @Inject('NOTION_SCHEMA') private notionModel: Model<Notion>,
    ) {
        this.notion = new Client({ auth: process.env.NOTION_TOKEN });
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Notion> {
        try {
            const databaseId = process.env.ID_DO_BANCO;

            if (!databaseId) {
                throw new Error(
                    'ID_DO_BANCO não está definido nas variáveis de ambiente.',
                );
            }

            const response = await this.notion.pages.create({
                parent: {
                    database_id: databaseId,
                },
                properties: createTaskDto.page.properties,
            });

            // Salvar no MongoDB
            const savedTask = await this.notionRepository.createTask(response);

            console.log('Salvando Task do Notion no banco');
            return savedTask;
        } catch (error) {
            console.error(
                'Erro ao criar a tarefa no Notion ou salvar no banco de dados:',
                error,
            );
            throw error;
        }
    }
}
