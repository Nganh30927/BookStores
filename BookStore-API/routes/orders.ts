import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Order } from '../entities/orders.entity';

const repository = AppDataSource.getRepository(Order);

const router = express.Router();

