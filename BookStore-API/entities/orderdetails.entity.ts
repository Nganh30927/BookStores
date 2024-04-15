import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Book } from './book.entity';
import { Order } from './orders.entity';

@Entity({ name: 'OrderDetails' })
@Check(`"Discount" >= 0`, `"Discount" <= 100`)
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @IsNotEmpty()
  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 2, default: 1 })
  quantity: number;

  @IsNotEmpty()
  @Column({ name: 'Price', type: 'money' })
  price: number;

  @IsNotEmpty()
  @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2 })
  discount: number;

  @IsNotEmpty()
  @Column({ name: 'SubTotalOrder', type: 'money' })
  subtotalorder: number;

  @Column({ type: 'int' })
  bookId: number;

  @Column({ type: 'int' })
  orderId: number;

  @ManyToOne(() => Book, (b) => b.orderDetails)
  book: Book;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  order: Order;
}
