import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    app.setGlobalPrefix('api/v1', {
        exclude: ['/'],
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'script-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:', 'validator.swagger.io'],
                },
            },
            hsts: {
                maxAge: 86400,
                includeSubDomains: true,
            },
        }),
    );

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Notion API')
        .setDescription('API de Manipulação aos dados do Notion')
        .setVersion('0.1')
        .addTag('API Notion')
        .setContact(
            'ROBSON',
            'https://github.com/RobsonFe/api-notion-todo',
            'robson-ferreiradasilva@hotmail.com',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    await app.listen(8080);

    console.log(
        'Acesse a documentação da API na URL: http://localhost:8080/docs',
    );
}
bootstrap();
