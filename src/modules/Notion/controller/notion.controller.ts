/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { NotionService } from '../service/notion.service';
import { Notion } from '../schema/notion.schema';
import { CreateTaskDto } from 'src/modules/dto/create-task.dto';
@ApiTags('Notion')
@Controller('notion')
export class NotionController {
    constructor(private readonly notionService: NotionService) {}

    //Criar Tarefa no Notion
    @ApiHeader({
        name: 'Criar Tarefa',
        description:
            'Cria uma tarefa no Notion e salva no banco de dados a tarefa',
    })
    @Post('create')
    @ApiResponse({ status: 201, description: 'Tarefa realizada com sucesso' })
    @ApiResponse({ status: 200, description: 'Tarefa realizada com sucesso' })
    @ApiCreatedResponse({
        description: 'Tarefa realizada com sucesso.',
    })
    @ApiForbiddenResponse({ description: 'Erro ao realizar a Tarefa' })
    @ApiResponse({
        status: 403,
        description: 'Usuario não tem permissão para criar recurso',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe uma Tarefa com os mesmos recursos',
    })
    @ApiResponse({ status: 500, description: 'Ocorreu um erro no servidor' })
    @HttpCode(HttpStatus.CREATED)
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Notion> {
        return this.notionService.createTask(createTaskDto);
    }
}
