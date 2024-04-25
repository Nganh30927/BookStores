require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '',
  port: 1433,
  username: '',
  password: '',
  database: 'BookShop',
  entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});
