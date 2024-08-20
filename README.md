<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Descrição do Projeto

Esse projeto consiste em uma API feita em NestJS integrada com o banco de dados MongoDB e API do Notion, para o gerenciamento de tarefas, gerando relatórios em excel a cada requisição, com documentação no Swagger e OpenAPI.

## Tecnologias Utilizadas no Projeto

-   NestJS: Framework de desenvolvimento de aplicativos Node.js
-   API do Notion para o gerenciamento de tarefas.
-   Banco de dados MongoDB.
-   Swagger e OpenAPI para documentação da API.
-   Biblioteca XLSX para gerar relatórios Node em Excel.

## Front-End

Para o front-end, foi utilizado o Angular, com o Flowbite e Tailwind para a criação de component.
<br>
[Repositório do Front-end](https://github.com/RobsonFe/notion-front)

## Instalação

```bash
$ npm install
```

ou

```bash
$ yarn install
```

Este projeto utiliza algumas bibliotecas que não estão incluídas por padrão ao iniciar um novo projeto NestJS. Siga as instruções abaixo para instalar essas dependências:

### 1. Instale as dependências adicionais

Execute o seguinte comando no terminal para instalar as bibliotecas:

```bash
npm install @nestjs/config @nestjs/mongoose @nestjs/swagger @notionhq/client @types/express @types/jest @types/node @types/supertest @types/uuid @typescript-eslint/eslint-plugin @typescript-eslint/parser class-transformer class-validator dotenv eslint eslint-config-prettier eslint-plugin-prettier helmet jest mongoose notion-client prettier reflect-metadata rxjs source-map-support supertest ts-jest ts-loader ts-node tsconfig-paths typescript xlsx
```

### 2. Dependências específicas

Caso precise instalar alguma dependência específica com uma versão fixa, utilize os comandos abaixo:

```bash
npm install @nestjs/cli@10.4.4
npm install @nestjs/config@3.2.3
npm install @nestjs/mongoose@10.0.10
npm install @nestjs/swagger@7.4.0
npm install @notionhq/client@2.2.15
npm install @types/express@4.17.21
npm install @types/jest@29.5.12
npm install @types/node@20.14.15
npm install @types/supertest@6.0.2
npm install @types/uuid@10.0.0
npm install @typescript-eslint/eslint-plugin@7.18.0
npm install @typescript-eslint/parser@7.18.0
npm install class-transformer@0.5.1
npm install class-validator@0.14.1
npm install dotenv@16.4.5
npm install eslint-config-prettier@9.1.0
npm install eslint-plugin-prettier@5.2.1
npm install eslint@8.57.0
npm install helmet@7.1.0
npm install jest@29.7.0
npm install mongoose@8.5.3
npm install notion-client@6.16.0
npm install prettier@3.3.3
npm install reflect-metadata@0.2.2
npm install rxjs@7.8.1
npm install source-map-support@0.5.21
npm install supertest@7.0.0
npm install ts-jest@29.2.4
npm install ts-loader@9.5.1
npm install ts-node@10.9.2
npm install tsconfig-paths@4.2.0
npm install typescript@5.5.4
npm install xlsx@0.18.5
```

---

## Endpoints da API

-   Schema

```json
{
    "title": "Estudar TypeScript",
    "status": "Em andamento",
    "priority": "Alta"
}
```

# Documentação da API

## Visão Geral

Esta API REST gerencia tarefas com os seguintes campos: `title`, `status`, `priority`, e `notionPageId`. Abaixo estão descritos os principais endpoints da API.

## Endpoints

### 1. **Criar Tarefa**

-   **URL:** `/api/v1/notion/create`
-   **Método:** `POST`
-
-   **Descrição:** Cria uma nova tarefa.
-   **Corpo da Requisição:**
    ```json
    {
        "title": "Estudar TypeScript",
        "status": "Em andamento",
        "priority": "Alta"
    }
    ```
-   **Resposta de Sucesso:**
    -   **Código:** `201 Created`
    -   **Exemplo de Corpo da Resposta:**
        ```json
        {
            "_id": "unique_task_id",
            "title": "Estudar TypeScript",
            "status": "Em andamento",
            "priority": "Alta",
            "notionPageId": "generated_notion_page_id",
            "__v": 0
        }
        ```
-   **Respostas de Erro Comuns:**
    -   **Código:** `400 Bad Request` – Se houver erro de validação nos dados.

### 2. **Listar Tarefas**

-   **URL:** `/api/v1/notion/list`
-   **Método:** `GET`
-   **Descrição:** Retorna uma lista de todas as tarefas.
-   **Parâmetros de Consulta (Opcional):**
    -   `page`: Número da página para paginação (padrão: 1).
    -   `limit`: Número de resultados por página (padrão: 10).
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Exemplo de Corpo da Resposta:**
        ```json
        {
            "result": [
                {
                    "_id": "66bf8be8c694350ab412b3c8",
                    "title": "Aprender Angular",
                    "status": "Não iniciada",
                    "priority": "Atenção",
                    "notionPageId": "8129cb6f-4b11-481c-8585-2a73552b9719",
                    "__v": 0
                },
                {
                    "_id": "66c424e9e5ec7060c0a63916",
                    "title": "Estudar Java",
                    "status": "Em andamento",
                    "priority": "Alta",
                    "notionPageId": "d9053095-4fe1-4e53-90b6-1bdb126fc838",
                    "__v": 0
                },
                {
                    "_id": "66c426e0e5ec7060c0a63920",
                    "title": "Estudar Node",
                    "status": "Concluído",
                    "priority": "Baixa",
                    "notionPageId": "c9d87e72-2dcc-4cdc-bba9-a9ed70c5c50b",
                    "__v": 0
                },
                {
                    "_id": "66c49380c180076805114df7",
                    "title": "Estudar React",
                    "status": "Concluído",
                    "priority": "Alta",
                    "notionPageId": "23dc011f-0aec-4c18-acaf-5c2b9faee9cc",
                    "__v": 0
                },
                {
                    "_id": "66c4a27dc180076805114dfd",
                    "title": "Estudar JavaScript",
                    "status": "Não iniciada",
                    "priority": "Alta",
                    "notionPageId": "597cdf91-497b-4ad0-bae5-6eb51779854f",
                    "__v": 0
                }
            ],
            "count": 5,
            "page": 1,
            "limit": 10
        }
        ```

### 3. **Obter Detalhes de uma Tarefa**

-   **URL:** `/api/v1/notion/buscar/{id}`
-   **Método:** `GET`
-   **Descrição:** Retorna os detalhes de uma tarefa específica.
-   **Parâmetros de Caminho:**
    -   `id`: O ID da tarefa a ser retornada.
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Exemplo de Corpo da Resposta:**
        ```json
        {
            "_id": "66c424e9e5ec7060c0a63916",
            "title": "Estudar Java",
            "status": "Em andamento",
            "priority": "Alta",
            "notionPageId": "d9053095-4fe1-4e53-90b6-1bdb126fc838",
            "__v": 0
        }
        ```
-   **Respostas de Erro Comuns:**
    -   **Código:** `404 Not Found` – Se a tarefa com o ID fornecido não for encontrada.

### 4. **Atualizar Tarefa**

-   **URL:** `/api/v1/notion/atualizar/{id}`
-   **Método:** `PUT`
-   **Descrição:** Atualiza uma tarefa existente.
-   **Parâmetros de Caminho:**
    -   `id`: O ID da tarefa a ser atualizada.
-   **Corpo da Requisição:**
    ```json
    {
        "title": "Estudar TypeScript e Angular",
        "status": "Em andamento",
        "priority": "Alta"
    }
    ```
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Exemplo de Corpo da Resposta:**
        ```json
        {
            "_id": "66c424e9e5ec7060c0a63916",
            "title": "Estudar TypeScript e Angular",
            "status": "Em andamento",
            "priority": "Alta",
            "notionPageId": "d9053095-4fe1-4e53-90b6-1bdb126fc838",
            "updatedAt": "2024-08-20T14:00:00Z",
            "__v": 0
        }
        ```
-   **Respostas de Erro Comuns:**
    -   **Código:** `400 Bad Request` – Se houver erro de validação nos dados.
    -   **Código:** `404 Not Found` – Se a tarefa com o ID fornecido não for encontrada.

### 5. **Deletar Tarefa**

-   **URL:** `/api/v1/notion/delete-task/{id}`
-   **Método:** `DELETE`
-   **Descrição:** Remove uma tarefa específica.
-   **Parâmetros de Caminho:**
    -   `id`: O ID da tarefa a ser removida.
-   **Resposta de Sucesso:**
    -   **Código:** `204 No Content`
-   **Respostas de Erro Comuns:**
    -   **Código:** `404 Not Found` – Se a tarefa com o ID fornecido não for encontrada.

## License

Licença [MIT licensed](LICENSE).
