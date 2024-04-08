import express, { Express, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-soucre';
const app: Express = express();
AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized'); //kiểm tra kết nối

  
});

export default app;
