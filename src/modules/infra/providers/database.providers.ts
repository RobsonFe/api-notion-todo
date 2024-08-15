import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
dotenv.config();

/**
 * Arquivo responsável por prover a conexão com o banco de dados.
 * @module databaseProviders
 */

/**
 * Provedor de conexão com o banco de dados.
 * @type {Array}
 */
export const databaseProviders: Array<any> = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (): Promise<typeof mongoose> =>
            await mongoose.connect(process.env.MONGO_URI).then(() => mongoose),
    },
];
