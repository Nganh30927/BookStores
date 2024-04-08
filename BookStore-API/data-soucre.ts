import "reflect-metadata";
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '',
  port: 1433,
  username: '',
  password: '',
  database: '',
  entities: ['src/entities/**/*.entity{.ts,.js}', 'src/entities/**/*.schema{.ts,.js}'],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});