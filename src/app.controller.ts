import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Documentação')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiHeader({
        name: 'Documentação',
        description:
            'Essa API tem o objetivo de interagir de forma reativa ao Notion e ao mesmo tempo ser um microsserviço.',
    })
    @ApiOperation({ summary: 'Documentação da API.' })
    getHello(): string {
        return this.appService.getHello();
    }
}
