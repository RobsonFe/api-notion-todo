import { DatabaseModule } from 'src/modules/infra/database/database.module';
import { NotionController } from '../controller/notion.controller';
import { NotionService } from '../service/notion.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { NotionRepository } from '../repository/notion.repository';
import { NotionProviders } from '../provider/notion.providers';

@Module({
    imports: [DatabaseModule, ConfigModule.forRoot()],
    providers: [NotionService, NotionRepository, ...NotionProviders],
    controllers: [NotionController],
    exports: [NotionService, NotionRepository, ...NotionProviders],
})
export class NotionModule {}
