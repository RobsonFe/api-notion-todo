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
                properties: {
                    Tarefa: {
                        title: [{ text: { content: createTaskDto.title } }],
                    },
                    Status: {
                        status: {
                            name: createTaskDto.status,
                        },
                    },
                    Prioridade: {
                        select: {
                            name: createTaskDto.priority,
                        },
                    },
                },
            });

            const notion = new this.notionModel({
                title: createTaskDto.title,
                status: createTaskDto.status,
                priority: createTaskDto.priority,
                notionPageId: response.id,
            });

            return await notion.save();
        } catch (error) {
            console.error(
                'Erro ao criar a tarefa no Notion ou salvar no banco de dados:',
                error,
            );
            throw error;
        }
    }

    async findAll(page: number, limit: number) {
        const result = await this.notionRepository.findAllNotion(page, limit);
        const count = await this.notionRepository.countDocuments();
        console.log(
            `Dados Requisitados: ${result}\n Total de Páginas: ${page}\n Limite de Páginas: ${limit}\n Total de Dados no Banco: ${count}`,
        );
        return { result, count, page, limit };
    }
}
