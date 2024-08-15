export interface TasksDto {
    id: String;
    page: {
        properties: {
            Prioridade: {
                id: string;
                type: string;
                select: {
                    id: string;
                    name: string;
                    color: string;
                };
            };
            Status: {
                id: string;
                type: string;
                status: {
                    id: string;
                    name: string;
                    color: string;
                };
            };
            Tarefa: {
                id: string;
                type: string;
                title: [
                    {
                        type: string;
                        text: {
                            content: string;
                            link?: null;
                        };
                        annotations: {
                            bold: false;
                            italic: false;
                            strikethrough: false;
                            underline: false;
                            code: false;
                            color: string;
                        };
                        plain_text: string;
                        href?: null;
                    },
                ];
            };
        };
    };
}
