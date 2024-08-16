import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Prioridade, Status } from '../enum/notion.enum';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'O titulo da Tarefa',
        required: true,
        example: 'Estudar TypeScript',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Status da Tarefa',
        required: true,
        enum: Status,
        example: Status.EM_ANDAMENTO,
    })
    @IsEnum(Status)
    status: Status;

    @ApiProperty({
        description: 'Prioridade da Tarefa',
        required: true,
        enum: Prioridade,
        example: Prioridade.ALTA,
    })
    @IsEnum(Prioridade)
    priority: Prioridade;
}
