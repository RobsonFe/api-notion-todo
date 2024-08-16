import { DatabaseModule } from './modules/infra/database/database.module';
import { NotionModule } from './modules/Notion/module/notion.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionController } from './modules/Notion/controller/notion.controller';
import { ConfigModule } from '@nestjs/config';
import { NotionService } from './modules/Notion/service/notion.service';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        NotionModule,
    ],
    controllers: [AppController, NotionController],
    providers: [AppService, NotionService],
})
export class AppModule {}
