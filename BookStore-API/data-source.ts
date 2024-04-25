require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'DESKTOP-GUC2D7U',
  port: 1433,
  username: 'sa',
  password: '12345',
  database: 'BookShop',
  entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});
