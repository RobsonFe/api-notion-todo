import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTaskDto {
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
        example: 'Em andamento',
    })
    @IsString()
    status: string;

    @ApiProperty({
        description: 'Prioridade da Tarefa',
        required: true,
        example: 'Alto',
    })
    @IsString()
    priority: string;
}
