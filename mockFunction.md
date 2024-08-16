//Service

async update(id: string, updateData: Partial<Notion>) {
        try {
            const notionPage = await this.findById(id);
            if (!notionPage) {
                throw new Error('ID do banco de dados não encontrado');
            }

            if (notionPage.notionPageId !== updateData.notionPageId) {
                throw new Error('ID do Notion não coincide');
            }

            const updatedNotion = await this.notionRepository.update(
                id,
                updateData,
            );
            if (!updatedNotion) {
                throw new Error('Erro ao atualizar os dados');
            }

            const response = await this.notion.pages.update({
                page_id: updateData.notionPageId,
                ...updatedNotion,
            });

            return { updatedNotion, response };
        } catch (error) {
            console.error('Erro na atualização:', error);
            throw new Error('Erro ao atualizar a consulta');
        }
}
    
// Controller

async update(
        @Param('id') id: string,
        @Body() updateNotion: Partial<Notion>,
    ) {
        try {
            return await this.notionService.update(id, updateNotion);
        } catch (error) {
            console.error(
                `Erro na atualização, o ID: ${id} fornecido não foi encontrado`,
                error,
            );
            throw new InternalServerErrorException(
                'Erro ao atualizar os dados',
            );
        }
}
    
// Repository

async update(id: string, updateData: Partial<Notion>) {
        try {
            const updatedNotion = await this.notionModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                    upsert: true,
                })
                .exec();

            return updatedNotion;
        } catch (error) {
            console.error('Erro na atualização dos dados:', error);
            throw new Error('Erro ao consultar os dados.');
        }
    }
