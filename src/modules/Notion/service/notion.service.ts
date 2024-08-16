import { Inject, Injectable } from '@nestjs/common';
import { NotionRepository } from '../repository/notion.repository';
import { Model } from 'mongoose';
import { Notion } from '../schema/notion.schema';
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';
import * as XLSX from 'xlsx';
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

            const notionJson = {
                title: notion.title,
                status: notion.status,
                priority: notion.priority,
                notionPageId: notion.notionPageId,
            };

            const file_path = `./planilhas/Tarefas.xlsx`;
            // Criar uma nova planilha e adicionar os dados
            const workbook = XLSX.utils.book_new(); // Cria um novo arquivo Excel
            const worksheet = XLSX.utils.json_to_sheet([notionJson]); // Adiciona o JSON na planilha
            XLSX.utils.book_append_sheet(workbook, worksheet, `Tarefas`); // Cria a planilha com todos os dados passados.
            XLSX.writeFile(workbook, file_path); // Arquivo Excel que será escrito e o caminho onde ficará salvo o arquivo.

            console.table(notionJson);
            console.log(`Arquivo salvo em: ${file_path}`);

            return await notion.save();
        } catch (error) {
            console.error(
                'Erro ao criar a tarefa no Notion ou salvar no banco de dados:',
                error,
            );
            throw error;
        }
    }

    async findById(id: string) {
        console.log(`ID para ser consultado: ${id}`);
        return await this.notionRepository.findById(id);
    }

    async findByIdNotion(notionPageId: string) {
        console.log(`ID do Notion para ser consultado: ${notionPageId}`);
        return await this.notionRepository.findByIdNotion(notionPageId);
    }

    async findAll(page: number, limit: number) {
        const result = await this.notionRepository.findAll(page, limit);
        const count = await this.notionRepository.countDocuments();
        console.log(
            `Dados Requisitados: ${result}\n Total de Páginas: ${page}\n Limite de Páginas: ${limit}\n Total de Dados no Banco: ${count}`,
        );
        return { result, count, page, limit };
    }

    async delete(id: string) {
        console.log(`ID do dado que será deletado ${id}`);
        return this.notionRepository.delete(id);
    }

    async update(id: string, updateData: Partial<Notion>) {
        try {
            const updatedNotion = await this.notionRepository.update(
                id,
                updateData,
            );

            if (!updatedNotion) {
                throw new Error('Consulta não encontrada');
            }
            console.log('Atualização dos Dados: ', updatedNotion);
            return updatedNotion;
        } catch (error) {
            console.error('Erro na atualização:', error);
            throw new Error('Erro ao atualizar a consulta');
        }
    }
}
