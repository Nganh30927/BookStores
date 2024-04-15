import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Cart } from './cart.entity';

@Entity({ name: 'Receipts' })
export class Receipt {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @IsNotEmpty()
  @Column({ name: 'DatePayment', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  datePayment: Date;

  @IsNotEmpty()
  @Column({ name: 'StatusPayment', type: 'varchar', default: 'WAITING', enum: ['WAITING', 'COMPLETED', 'CANCELED'] })
  statusPayment: string;

  @IsNotEmpty()
  @Column({ name: 'TotalPayment', type: 'money' })
  totalPayment: number;

  @Column({ type: 'int' })
  cartId: number;

  @ManyToOne(() => Cart, (c) => c.receipts)
  cart: Cart;
}
