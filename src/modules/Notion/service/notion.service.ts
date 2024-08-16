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
        // Começar uma transação para as operações do banco de dados, se possível
        const session = await this.notionModel.startSession();
        session.startTransaction();

        try {
            const databaseId = process.env.ID_DO_BANCO;

            if (!databaseId) {
                throw new Error(
                    'ID_DO_BANCO não está definido nas variáveis de ambiente.',
                );
            }

            // Passo 1: Criar a tarefa no Notion
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

            // Passo 2: Salvar no banco de dados
            const notion = new this.notionModel({
                title: createTaskDto.title,
                status: createTaskDto.status,
                priority: createTaskDto.priority,
                notionPageId: response.id,
            });

            await notion.save({ session }); // Salva no banco de dados

            // Passo 3: Atualizar a planilha
            const notionJson = {
                title: notion.title,
                status: notion.status,
                priority: notion.priority,
                notionPageId: notion.notionPageId,
            };

            const file_path = `./planilhas/Tarefas.xlsx`;
            let workbook;

            try {
                // Tentar carregar a planilha existente
                workbook = XLSX.readFile(file_path);
            } catch (error) {
                // Se o arquivo não existir, cria um novo workbook
                workbook = XLSX.utils.book_new();
            }

            // Pegar a worksheet existente ou criar uma nova
            let worksheet = workbook.Sheets['Tarefas'];
            if (!worksheet) {
                worksheet = XLSX.utils.json_to_sheet([notionJson]);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Tarefas');
            } else {
                // Converter worksheet para JSON, adicionar o novo dado, e converter de volta para worksheet
                const worksheetData = XLSX.utils.sheet_to_json(worksheet);
                worksheetData.push(notionJson);
                worksheet = XLSX.utils.json_to_sheet(worksheetData);
                workbook.Sheets['Tarefas'] = worksheet;
            }

            XLSX.writeFile(workbook, file_path); // Salvar o arquivo Excel

            console.log(`Arquivo salvo em: ${file_path}`);
            console.table(notionJson);

            // Se todas as operações forem bem-sucedidas, commit da transação
            await session.commitTransaction();
            session.endSession();

            return notion;
        } catch (error) {
            // Se ocorrer um erro, desfaz a transação do banco de dados
            await session.abortTransaction();
            session.endSession();

            console.error('Erro ao criar a tarefa ou salvar os dados:', error);
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
