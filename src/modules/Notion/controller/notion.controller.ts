import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiResponse,
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';
import { NotionService } from '../service/notion.service';
import { Notion } from '../schema/notion.schema';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';

@ApiTags('Notion')
@Controller('notion')
export class NotionController {
    constructor(private readonly notionService: NotionService) {}

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
}
