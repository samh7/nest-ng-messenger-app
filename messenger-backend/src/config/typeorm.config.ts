import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();



const AppDataSource = new DataSource({
    type: "mysql",
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    migrations: ['src/database/migrations/*-migration.ts'],
    migrationsRun: false,
    logging: true,

})


export default AppDataSource