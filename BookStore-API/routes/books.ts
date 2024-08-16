import express, { Request, Response } from 'express';
import { sendJsonSuccess } from '../helpers/responseHandler';
import { AppDataSource } from '../data-source';
import { Book } from '../entities/book.entity';
import { Order } from '../entities/orders.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Book);
const ordersRepository = AppDataSource.getRepository(Order);



router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    const { minPrice, maxPrice, categoryId } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100 //  giới hạn từ query parameter
    const page = req.query.page ? parseInt(req.query.page as string) : 1; // n số lượng bản ghi cần bỏ qua từ query parameter

    const query = repository.createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher');

    if (minPrice) {
      query.andWhere('book.price >= :minPrice', { minPrice }); // Thêm điều kiện WHERE vào truy vấn nếu có minPrice
    }

    if (maxPrice) {
      query.andWhere('book.price <= :maxPrice', { maxPrice }); // Thêm điều kiện WHERE vào truy vấn nếu có maxPrice
    }

    if (categoryId){
      query.andWhere('category.id = :categoryId', { categoryId })
    }

    const [books, totalCount] = await query
      .orderBy('book.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      books,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      recordsPerPage: limit
    };

    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});




// @Query("SELECT o FROM Books o WHERE o.name LIKE %?1%")
router.get('/search', async (req: Request, res: Response, next: any) => {
  try {
    const keyword = req.query.keyword;

    const books = await repository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('book.name LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

      sendJsonSuccess(res)(books);
    } catch (error) {
      next(error);
    }
});

// /* GET book by id */
// router.get('/:id', async (req: Request, res: Response, next: any) => {
//   try {
//     const book = await repository
//       .createQueryBuilder('book')
//       .leftJoinAndSelect('book.category', 'category')
//       .leftJoinAndSelect('book.publisher', 'publisher')
//       .where('book.id = :id', { id: parseInt(req.params.id) })
//       .getOne();
//     if (!book) {
//       return res.status(404).json({ error: 'Not found' });
//     }
//     sendJsonSuccess(res)(book);
//   } catch (error) {
//     next(error);
//   }
// });
router.get('/:id', async (req: Request, res: Response, next: any) => {
  const itemId = parseInt(req.params.id);

  try {
    // Fetch book details with category and publisher relations
    const found = await repository.findOneOrFail({
      where: { id: itemId },
      relations: ["category", "publisher"]
    });
    if (!found) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Fetch amount sold
    const amountSoldQuery = ordersRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.orderDetails", "orderDetail")
      .leftJoinAndSelect("orderDetail.book", "book")
      .where("order.status = :status", { status: "COMPLETED" })
      .andWhere("book.id = :bookId", { bookId: itemId })
      .select("book.id", "bookId")
      .addSelect("book.name", "bookName")
      .addSelect("book.price", "price")
      .addSelect("SUM(orderDetail.quantity)", "totalQuantity")
      .groupBy("book.id")
      .addGroupBy("book.name")
      .addGroupBy("book.price");

    const amountSold = await amountSoldQuery.getRawOne();

    // Combine the book details with the amount sold
    const result = {
      ...found,
      amountSold: amountSold ? amountSold.totalQuantity : 0
    };
    
    // Send the combined result
    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});

router.post("/orderm/:orderId/stock", async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const orders = await ordersRepository.findOne({
      where: { id: orderId },
      relations: ["orderDetails", "orderDetails.book"]
    });

    if (!orders) {
      return res.status(404).json({ error: "Order not found" });
    }

    for (const orderDetails of orders.orderDetails) {
      const bookId = orderDetails.book.id; 
      const quantity = orderDetails.quantity;
    
      const book = await repository.findOne({ where: { id: bookId } });

      if (!book) {
        console.log(`Book not found for order detail: ${orderDetails.orderId}`);
        continue;
      }

      book.stock += quantity;
      await repository.save(book);

    }

    res.json({ message: "quantity updated successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/orderp/:orderId/stock", async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const order = await ordersRepository.findOne({
      where: { id: orderId },
      relations: ["orderDetails", "orderDetails.book"]
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    for (const orderDetail of order.orderDetails) {
      const bookId = orderDetail.book.id; 
      const quantity = orderDetail.quantity;
    
      const book = await repository.findOne({ where: { id: bookId } });

      if (!book) {
        console.log(`Book not found for order detail: ${orderDetail.orderId}`);
        continue;
      }

      book.stock -= quantity;
      await repository.save(book);
    }

    res.json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error(error);
   next(error)
  }
});



/* POST book */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const book = new Book();
    Object.assign(book, req.body);
    await repository.save(book);
    sendJsonSuccess(res)(book);
  } catch (error) {
    next(error);
  }
});


/* PATCH book */
router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const book = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!book) {
      return res.status(404).json({ error: 'Not found' });
    }
    Object.assign(book, req.body);
    await repository.save(book);
    const updatedBook = await repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.category', 'c')
      .where('b.id = :id', { id: parseInt(req.params.id) })
      .getOne();
      sendJsonSuccess(res)(updatedBook);
    } catch (error) {
      next(error);
    }
});
/* DELETE book */
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const book = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!book) {
      return res.status(404).json({ error: 'Not found' });
    }
    await repository.delete({
      id: book.id,
    });
    sendJsonSuccess(res)(book);
  } catch (error) {
    next(error);
  }
});



// Hiển thị danh sách sản phẩm có discount >=
router.get('/sales/hotsales', async (req: Request, res: Response, next: any) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10; // số lượng sản phẩm cần lấy

    const books = await repository.createQueryBuilder('book')
    .where('book.discount >= :minDiscount AND book.discount <= :maxDiscount', { minDiscount: 50, maxDiscount: 90 })
    .orderBy('book.id', 'DESC')
    .take(limit)
    .getMany();
    

    if (!books) {
      return res.status(404).json({ error: 'Not found' });
    }
    sendJsonSuccess(res)(books);
  } catch (error) {
    next(error);
  }
});





export default router;
