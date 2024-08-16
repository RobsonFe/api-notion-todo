import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return `
      <h1>
      Ativos - Notion API
      </h1>
      <a href="/docs">Documentação</a>
      `;
    }
}
