import { Check, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Book } from './book.entity';
import { Order } from './orders.entity';

@Entity({ name: 'OrderDetails' })
@Check(`"Discount" >= 0`)
@Check(`"Discount" <= 100`)
export class OrderDetail {
   
    @PrimaryColumn({ type: 'int' })
    bookId: number;

    @PrimaryColumn({ type: 'int' })
    orderId: number;


    @IsNotEmpty()
    @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 2, default: 1 })
    quantity: number;

    @IsNotEmpty()
    @Column({ name: 'Price', type: 'money' })
    price: number;

    @IsNotEmpty()
    @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2})
    discount: number;

    @IsNotEmpty()
    @Column({ name: 'SubTotalOrder', type: 'money' })
    subtotalorder: number;

   

    @ManyToOne(() => Book, (b) => b.orderdetails)
    book: Book;

    @ManyToOne(() => Order, (o) => o.orderDetails)
    order: Order;


}