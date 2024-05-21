import { Check, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Book } from './book.entity';
import { Order } from './orders.entity';

@Entity({ name: 'OrderDetails' })
@Check(`"Discount" >= 0`)
@Check(`"Discount" <= 100`)
export class OrderDetail {
  @PrimaryColumn({ type: 'int' })
  orderId: number;

  @PrimaryColumn({ type: 'int' })
  bookId?: number;

  @IsNotEmpty()
  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 2, default: 1 })
  quantity: number;

  @IsNotEmpty()
  @Column({ name: 'Price', type: 'money' })
  price: number;

  @IsNotEmpty()
  @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2 })
  discount: number;

  // SELECT quantity * price * (1 - discount/100) AS subtotalorder FROM OrderDetail;
  @Column({ name: 'SubTotalOrder', type: 'money', nullable: true })
  subtotalorder?: number;

  @ManyToOne(() => Book, (b) => b.orderDetails)
  book: Book;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  order: Order;
}