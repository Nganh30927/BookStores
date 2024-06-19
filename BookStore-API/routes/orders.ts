import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Order } from '../entities/orders.entity';
import { OrderDetail } from '../entities/orderdetails.entity';
import { Member } from '../entities/member.entity';
const repository = AppDataSource.getRepository(Order);

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: any) => {
  try {
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
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.orderId',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ])
      .getMany();

    if (orders.length === 0) {
      res.status(204).send();
    } else {
      res.json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
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
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.orderId',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ])
      .getOne();

    if (order) {
      res.json(order);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const createOrder = async (payload: any, queryRunner: any) => {
  // Check if member already exists
  let member = await queryRunner.manager.findOne(Member, { where: { email: payload.email } });

  if (!member) {
    // Create new Member if not exists
    const createDataMember = {
      name: payload.name,
      email: payload.email,
      contact: payload.contact,
      address: payload.shippingaddress,
    };
    member = await queryRunner.manager.save(Member, createDataMember);
  }

  // Create Order
  const createDataOrder = {
    orderday: new Date(),
    description: payload.description,
    shippingaddress: payload.shippingaddress,
    paymenttype: payload.paymenttype,
    member: member, // Link the member to the order
  };
  const order = await queryRunner.manager.save(Order, createDataOrder);

  return order;
};

router.post('/', async (req: Request, res: Response, next: any) => {
  const queryRunner = repository.manager.connection.createQueryRunner();
  await queryRunner.connect();

  try {
    // Begin transaction
    await queryRunner.startTransaction();

    const payload = req.body;

    console.log('Received payload:', payload);

    const result = await createOrder(payload, queryRunner);

    // Check both `orderDetail` and `orderDetails`
    const orderDetails = payload.orderDetails || payload.orderDetail;

    // Validate orderDetails
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      throw new Error('orderDetails must be a non-empty array');
    }

    // Map orderDetails and add orderId
    const mappedOrderDetails = orderDetails.map((od: any) => ({
      bookId: od.id, // Ensure bookId is mapped correctly
      price: od.price,
      name: od.name,
      quantity: od.quantity,
      imageURL: od.imageURL,
      discount: od.discount,
      orderId: result.id,
    }));

    // Log orderDetails for debugging
    console.log('Order Details to be saved:', mappedOrderDetails);

    // Save orderDetails
    await queryRunner.manager.save(OrderDetail, mappedOrderDetails);

    // Commit transaction
    await queryRunner.commitTransaction();

    // Redirect to order details page
    res.redirect(`/orders/${result.id}`);
  } catch (error) {
    // Rollback transaction on error
    await queryRunner.rollbackTransaction();
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Release query runner after transaction
    await queryRunner.release();
  }
});








// router.post('/', async (req: Request, res: Response, next: any) => {
//   try {
//     const queryRunner = repository.manager.connection.createQueryRunner();
//     await queryRunner.connect();
//     // Begin transaction
//     try {
//       await queryRunner.startTransaction();

//       const order = req.body as Order;

//       // Lưu thông tin order
//       const result = await queryRunner.manager.save(Order, order);

//       // Lưu thông tin order details
//       const orderDetails = order.orderDetails?.map((od) => {
//         return { ...od, orderId: result.id };
//       });

//       await queryRunner.manager.save(OrderDetail, orderDetails);

//       // Commit transaction
//       await queryRunner.commitTransaction();

//       // Get order by id
//       res.redirect(`/orders/${result.id}`);
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       console.error(error);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await repository.findOne({ where: { id: orderId }, relations: ['orderDetails'] });
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }

    const updatedOrderData = req.body as Order;
    const updatedOrder = repository.merge(order, updatedOrderData);

    // Update order details
    const orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    for (const detail of updatedOrderData.orderDetails) {
      const existingDetail = order.orderDetails.find((d) => d.orderId === detail.orderId && d.bookId === detail.bookId);
      if (existingDetail) {
        orderDetailRepository.merge(existingDetail, detail);
        await orderDetailRepository.save(existingDetail);
      } else {
        await orderDetailRepository.save(detail);
      }
    }

    await repository.save(updatedOrder);

    const result = await repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('o.id = :id', { id: orderId })
      .select([
        'o.id',
        'o.orderday',
        'o.shippedday',
        'o.status',
        'o.shippingaddress',
        'o.paymenttype',
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ])
      .getOne();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await repository.findOne({ where: { id: orderId }, relations: ['orderDetails'] });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete order details
    const orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    for (const detail of order.orderDetails) {
      await orderDetailRepository.remove(detail);
    }

    // Delete order
    await repository.remove(order);
    res.status(200).send({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
