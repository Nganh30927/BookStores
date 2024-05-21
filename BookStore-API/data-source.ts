require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'developer',
  password: 'developer',
  database: 'BookOnlineStore',
  entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});

// export const AppDataSource = new DataSource({
//   type: 'mssql',
//   host: 'localhost',
//   port: 1433,
//   username: 'developer',
//   password: 'developer',
//   database: 'BookOnlineStore',
//   entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
//   synchronize: true,
//   logging: false,
//   options: {
//     encrypt: false,
//   },
// });
