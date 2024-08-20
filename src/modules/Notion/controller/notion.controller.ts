import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiResponse,
    ApiTags,
    ApiOperation,
    ApiHeader,
    ApiOkResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { NotionService } from '../service/notion.service';
import { Notion } from '../schema/notion.schema';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';

@ApiTags('Notion')
@Controller('notion')
export class NotionController {
    constructor(private readonly notionService: NotionService) {}

    @ApiHeader({
        name: 'Cria uma tarefa no Notion',
        description: 'Cria uma tarefa no Notion e salva no banco de dados',
    })
    @Post('create')
    @ApiOperation({ summary: 'Criar uma nova tarefa no Notion' })
    @ApiResponse({ status: 201, description: 'Tarefa realizada com sucesso' })
    @ApiCreatedResponse({
        description: 'Tarefa criada e salva no banco de dados com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a tarefa' })
    @ApiResponse({
        status: 403,
        description: 'Usuário não tem permissão para criar recurso',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe uma tarefa com os mesmos recursos',
    })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @HttpCode(HttpStatus.CREATED)
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Notion> {
        console.log('Dados Salvos: ', createTaskDto);
        return this.notionService.createTask(createTaskDto);
    }

    @ApiHeader({
        name: 'Lista dados salvos no banco',
        description: 'Lista todos os dados de tarefas no banco de dados.',
    })
    @ApiOperation({ summary: 'Listar todas as tarefas no banco de dados.' })
    @ApiResponse({ status: 200, description: 'Listagem retornada com sucesso' })
    @ApiResponse({ status: 204, description: 'A Lista está vazia' })
    @ApiResponse({ status: 400, description: 'Solicitação com erros' })
    @ApiResponse({ status: 401, description: 'Sem token de autorização' })
    @ApiResponse({ status: 403, description: 'Sem autorização' })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @ApiOkResponse({
        description: 'Listagem retornada com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a consulta' })
    @Get('list')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<{
        result: Notion[];
        count: number;
        page: number;
        limit: number;
    }> {
        try {
            const result = await this.notionService.findAll(
                Number(page),
                Number(limit),
            );
            if (result.result.length === 0) {
                throw new NotFoundException(`Os dados: ${result} estão vazios`);
            }
            return result;
        } catch (error) {
            console.error('Erro na procura dos dados', error);
            throw new InternalServerErrorException('Erro na procura dos dados');
        }
    }

    @ApiHeader({
        name: 'Busca dados pelo ID',
        description: 'Busca dados no banco de dados pelo ID da tarefa',
    })
    @Get('buscar/:id')
    @ApiOperation({ summary: 'Buscar dados pelo ID.' })
    @ApiResponse({ status: 200, description: 'Consulta Bem Sucedida' })
    @ApiResponse({ status: 404, description: 'Não Encontrado' })
    @ApiResponse({ status: 400, description: 'ID Inválido ou Não Existe' })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @ApiOkResponse({
        description: 'Dados atualizados com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a consulta' })
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<Notion | null> {
        try {
            const findId = await this.notionService.findById(id);
            if (findId === null) {
                throw new NotFoundException(`Esse ${id} não existe no banco`);
            }
            return findId;
        } catch (error) {
            console.error(`erro na busca do ID: ${id} `, error);
            throw new InternalServerErrorException(
                `Nenhum dado encontrado por esse ID: ${id}`,
            );
        }
    }

    @ApiHeader({
        name: 'Busca dados pelo ID do Notion',
        description: 'Busca dados no banco de dados pelo ID do Notion',
    })
    @Get('doc/:notionPageId')
    @ApiOperation({ summary: 'Buscar dados pelo ID do Notion.' })
    @ApiResponse({ status: 200, description: 'Consulta Bem Sucedida' })
    @ApiResponse({ status: 404, description: 'Não Encontrado' })
    @ApiResponse({
        status: 400,
        description: 'ID Inválido ou Não Existe',
    })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @ApiOkResponse({
        description: 'Dados atualizados com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a consulta' })
    @HttpCode(HttpStatus.OK)
    async findNotionPageId(
        @Param('notionPageId') notionPageId: string,
    ): Promise<Notion | null> {
        try {
            const notion =
                await this.notionService.findByIdNotion(notionPageId);
            if (!notion) {
                throw new NotFoundException(
                    `ID do Notion: ${notionPageId} não encontrado`,
                );
            }
            return notion;
        } catch (error) {
            console.error(
                `Erro ao buscar ID do Notion: ${notionPageId}:`,
                error,
            );
            throw error;
        }
    }

    @ApiHeader({
        name: 'Deletar uma Tarefa',
        description: 'Dados para serem deletados.',
    })
    @ApiOperation({ summary: 'Deletar dados pelo ID.' })
    @ApiNoContentResponse({
        description: 'Dados deletados com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a deleção' })
    @ApiResponse({ status: 204, description: 'Dados deletados com sucesso' })
    @ApiResponse({ status: 200, description: 'Dados deletados com sucesso' })
    @ApiResponse({ status: 400, description: 'ID invalido para a requisição' })
    @ApiResponse({ status: 401, description: 'Usuario não autenticado' })
    @ApiResponse({
        status: 403,
        description: 'Usuario sem permissão para deletar dados',
    })
    @ApiResponse({
        status: 404,
        description: 'Os dados para serem deletados não foram encontrados',
    })
    @ApiResponse({
        status: 409,
        description: 'Deleção em conflito com alguma regra de negocios',
    })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @Delete('deletar/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        try {
            const deleteById = await this.notionService.delete(id);
            if (!deleteById) {
                throw new NotFoundException(
                    `Id: ${id} informado para a remoção, não foi encontrado`,
                );
            }
        } catch (error) {
            console.error(`erro ao deletar dados do ID: ${id}`, error);
        }
    }

    @ApiHeader({
        name: 'Atualização de Dados',
        description: 'Dados para serem atualizados.',
    })
    @ApiOperation({ summary: 'Atualizar Dados das Tarefas.' })
    @ApiOkResponse({
        description: 'Dados atualizados com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a consulta' })
    @ApiResponse({ status: 200, description: 'Listagem retornada com sucesso' })
    @ApiResponse({ status: 204, description: 'A Lista está vazia' })
    @ApiResponse({
        status: 400,
        description: 'A solicitação contem erros ou dados invalidos',
    })
    @ApiResponse({ status: 401, description: 'O usuario sem autenticação' })
    @ApiResponse({
        status: 403,
        description: 'O usuario sem autorização para atualizar os dados',
    })
    @ApiResponse({
        status: 404,
        description: 'Os dados para atualização não foram encontrados',
    })
    @ApiResponse({
        status: 409,
        description: 'Atualização em conflitos com outras regras de negocios',
    })
    @ApiResponse({ status: 500, description: 'Ocorreu  um erro no servidor' })
    @Put('atualizar/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateNotion: Partial<Notion>,
    ) {
        try {
            return await this.notionService.update(id, updateNotion);
        } catch (error) {
            console.error(
                `Erro na atualização, o ID: ${id} fornecido não foi encontrado`,
                error,
            );
            throw new InternalServerErrorException(
                'Erro ao atualizar os dados',
            );
        }
    }
    @ApiHeader({
        name: 'Deletar uma Tarefa do Notion',
        description: 'Deletar uma tarefa no Notion e do banco de dados.',
    })
    @ApiOperation({
        summary: 'Deletar uma tarefa no Notion e no banco de dados.',
    })
    @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @Delete('delete-task/:id')
    @HttpCode(HttpStatus.OK)
    async deleteNotionTask(
        @Param('id') id: string,
        @Body() deleteData: Partial<Notion>,
    ): Promise<any> {
        console.log('ID recebido:', id);
        try {
            const result = await this.notionService.deleteNotionTask(id);
            return result;
        } catch (error) {
            if (error.message === 'Tarefa não encontrada no banco de dados') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException('Erro ao deletar a tarefa');
        }
    }
}
