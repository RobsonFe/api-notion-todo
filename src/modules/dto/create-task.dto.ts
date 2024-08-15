export interface CreateTaskDto {
    page: {
        properties: {
            Tarefa: {
                title: [
                    {
                        text: {
                            content: string;
                        };
                    },
                ];
            };
            Status: {
                status: {
                    name: string;
                };
            };
            Prioridade: {
                select: {
                    name: string;
                };
            };
        };
    };
}
