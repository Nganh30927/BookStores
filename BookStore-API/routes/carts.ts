import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Cart } from '../entities/cart.entity';
import router from './categories';


const repository = AppDataSource.getRepository(Cart);

router.get('/', async (req: Request, res: Response, next: any)=> {
    try{
        const carts = await repository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .leftJoinAndSelect('cart.cartDetails', 'cartDetails')
        .leftJoinAndSelect('cartDetails.book', 'book')
        .select([
            'cart.id',
            'cart.cartDate',
            'cart.cartStatus',
            'cart.memberId',
            'member',
            'cartDetails.cartquantity',
            'book'
        ]).getMany();

        if (carts.length === 0) {
            res.status(204).send();
          } else {
            res.json(carts);
          }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

export default router;