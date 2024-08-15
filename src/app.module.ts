import { DatabaseModule } from './modules/infra/database/database.module';
import { NotionModule } from './modules/Notion/module/notion.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [DatabaseModule, NotionModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
