import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
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
}
