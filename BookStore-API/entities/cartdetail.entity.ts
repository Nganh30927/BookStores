import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Book } from './book.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'CartDetails' })
export class CartDetail {
  @PrimaryColumn({ type: 'int' })
  cartId: number;

  @PrimaryColumn({ type: 'int' })
  bookId: number;

  @IsNotEmpty()
  @Column({ name: 'CartQuantity', type: 'int', default: 1 })
  cartquantity: number;

  @IsNotEmpty()
  @Column({ name: 'SubTotalCart', type: 'money' })
  subtotalcart: number;

  

  @ManyToOne(() => Book, (b) => b.cartDetails)
  book: Book;

  @ManyToOne(() => Cart, (c) => c.cartDetails)
  cart: Cart;
}