import { Inject, Injectable } from '@nestjs/common';
import { NotionRepository } from '../repository/notion.repository';
import { Model } from 'mongoose';
import { Notion } from '../schema/notion.schema';
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';
import * as XLSX from 'xlsx';
import { UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
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

    // Criar dados de tarefas no Notion e Salvar no banco de dados externo.
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

    // Atualizar dados do banco de dados e do Notion.
    async update(id: string, updateData: Partial<Notion>) {
        try {
            const { _id, ...dataToUpdate } = updateData;

            // Atualizar no banco de dados
            const updatedNotion = await this.notionRepository.update(
                id,
                dataToUpdate,
            );

            if (!updatedNotion) {
                throw new Error('Consulta não encontrada');
            }

            // Atualizar a página no Notion
            const notionUpdateData: UpdatePageParameters = {
                page_id: updatedNotion.notionPageId,
                properties: {
                    Tarefa: {
                        title: [
                            {
                                text: {
                                    content:
                                        dataToUpdate.title ||
                                        updatedNotion.title,
                                },
                            },
                        ],
                    },
                    Status: {
                        status: {
                            name: dataToUpdate.status || updatedNotion.status,
                        },
                    },
                    Prioridade: {
                        select: {
                            name:
                                dataToUpdate.priority || updatedNotion.priority,
                        },
                    },
                },
            };

            const response = await this.notion.pages.update(notionUpdateData);

            // Atualizar a planilha de Excel
            const file_path = `./planilhas/Tarefas.xlsx`;
            const workbook = XLSX.readFile(file_path);
            const worksheet = workbook.Sheets['Tarefas'];

            const worksheetData = XLSX.utils.sheet_to_json(worksheet);
            const updatedWorksheetData = worksheetData.map((row: any) => {
                if (row.notionPageId === updatedNotion.notionPageId) {
                    return {
                        ...row,
                        title: dataToUpdate.title || updatedNotion.title,
                        status: dataToUpdate.status || updatedNotion.status,
                        priority:
                            dataToUpdate.priority || updatedNotion.priority,
                    };
                }
                return row;
            });

            const newWorksheet = XLSX.utils.json_to_sheet(updatedWorksheetData);
            workbook.Sheets['Tarefas'] = newWorksheet;
            XLSX.writeFile(workbook, file_path);

            return { updatedNotion, response };
        } catch (error) {
            console.error(
                'Erro na atualização:',
                error.response?.data || error,
            );
            throw new Error('Erro ao atualizar a consulta');
        }
    }

    // Encontrar dados pelo ID do banco de dados.
    async findById(id: string) {
        console.log(`ID para ser consultado: ${id}`);
        return await this.notionRepository.findById(id);
    }

    // Encontrar dados pelo ID do Notion no banco de dados.
    async findByIdNotion(notionPageId: string) {
        console.log(`ID do Notion para ser consultado: ${notionPageId}`);
        return await this.notionRepository.findByIdNotion(notionPageId);
    }

    // Encontrar todos os dados do banco de dados
    async findAll(page: number, limit: number) {
        const result = (
            await this.notionRepository.findAll(page, limit)
        ).sort();
        const count = await this.notionRepository.countDocuments();
        console.log(
            `Dados Requisitados: ${result}\n Total de Páginas: ${page}\n Limite de Páginas: ${limit}\n Total de Dados no Banco: ${count}`,
        );
        return { result, count, page, limit };
    }

    // Deletar um item do banco de dados.
    async delete(id: string) {
        console.log(`ID do dado que será deletado ${id}`);
        return this.notionRepository.delete(id);
    }

    async deleteNotionTask(id: string) {
        console.log('ID do Banco de Dados para ser deletado:', id);
        try {
            // Encontrar o documento no banco de dados pelo ID do banco de dados
            const findNotionRecord = await this.notionRepository.findById(id);

            if (!findNotionRecord) {
                throw new Error('Tarefa não encontrada no banco de dados');
            }

            const { notionPageId } = findNotionRecord;

            // Deletar do banco de dados usando o ID encontrado
            const deleteByDatabase = await this.notionRepository.delete(id);

            // Deletar do Notion usando o notionPageId
            const notionDeleteResponse = await this.notion.pages.update({
                page_id: notionPageId,
                archived: true, // Marca a página como arquivada (ou "deletada")
            });

            // Atualizar a planilha de Excel para remover a tarefa deletada
            const file_path = `./planilhas/Tarefas.xlsx`;
            const workbook = XLSX.readFile(file_path);
            const worksheet = workbook.Sheets['Tarefas'];

            const worksheetData = XLSX.utils.sheet_to_json(worksheet);
            const updatedWorksheetData = worksheetData.filter(
                (row: any) => row.notionPageId !== notionPageId,
            );

            const newWorksheet = XLSX.utils.json_to_sheet(updatedWorksheetData);
            workbook.Sheets['Tarefas'] = newWorksheet;
            XLSX.writeFile(workbook, file_path);

            console.log(
                'Tarefa deletada com sucesso:',
                deleteByDatabase,
                notionDeleteResponse,
            );

            return { deleteByDatabase, notionDeleteResponse };
        } catch (error) {
            console.error('Erro ao deletar a tarefa:', error);
            throw new Error('Falha ao deletar a tarefa');
        }
    }
}
