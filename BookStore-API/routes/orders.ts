import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Order } from '../entities/orders.entity';
import { OrderDetail } from '../entities/orderdetails.entity';


const repository = AppDataSource.getRepository(Order);

const router = express.Router();



router.get('/', async (req: Request, res: Response, next: any) => {
    try{
        const orders = await repository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.member', 'member')
        .leftJoinAndSelect('o.employee', 'employee')
        .leftJoinAndSelect('o.orderDetails', 'orderDetails')
        .leftJoinAndSelect('orderDetails.book', 'book')
        .leftJoinAndSelect('book.category', 'category')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .select([
            'o.id',
            'o.orderday',
            'o.shippedday',
            'o.status',
            'o.shippingaddress',
            'o.paymenttype',
            'o.employeeId',
            'o.memberId',
            'employee',
            'member',
            'orderDetails.quantity',
            'orderDetails.price',
            'orderDetails.discount',
            'orderDetails.subtotalorder',
            'book',
            'category'
        ]).getMany();

        if (orders.length === 0) {
            res.status(204).send();
          } else {
            res.json(orders);
          }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get('/:id', async (req: Request, res: Response, next: any) => {
  try{
      const order = await repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('o.id = :id', { id: req.params.id })
      .select([
          'o.id',
          'o.orderday',
          'o.shippedday',
          'o.status',
          'o.shippingaddress',
          'o.paymenttype',
          'o.employeeId',
          'o.memberId',
          'employee',
          'member',
          'orderDetails.quantity',
          'orderDetails.price',
          'orderDetails.discount',
          'orderDetails.subtotalorder',
          'book',
          'category'
      ]).getOne();

      if (order) {
        res.json(order);
      } else {
        res.sendStatus(204);
      }
  }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const queryRunner = repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    // Begin transaction
    try {
      await queryRunner.startTransaction();

      const order = req.body as Order;

      // Lưu thông tin order
      const result = await queryRunner.manager.save(Order, order);

      // Lưu thông tin order details
      const orderDetails = order.orderDetails.map((od) => {
        return { ...od, orderId: result.id };
      });

      await queryRunner.manager.save(OrderDetail, orderDetails);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Get order by id
      res.redirect(`/orders/${result.id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      res.status(500).json({ error: 'Transaction failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const order = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }

    Object.assign(order, req.body);

    await repository.save(order);

    const updatedOrder = await repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .where('o.id = :id', { id: parseInt(req.params.id) })
      .getOne();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const order = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await repository.remove(order);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;