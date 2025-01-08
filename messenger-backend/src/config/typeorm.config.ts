import { DataSource } from 'typeorm';
import { DATABASE } from '../shared/environment';



const AppDataSource = new DataSource({
    type: "mysql",
    database: DATABASE.DB_NAME as string,
    host: DATABASE.DB_HOST as string,
    port: DATABASE.DB_PORT as number,
    username: DATABASE.DB_USERNAME as string,
    password: DATABASE.DB_PASSWORD as string,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    migrations: ['src/database/migrations/*-migration.ts'],
    migrationsRun: false,
    logging: true,

})


export default AppDataSource