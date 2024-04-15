import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Publisher } from './publisher.entity';
import { Order } from './orders.entity';

@Entity({ name: 'Invoices' })
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InvoiceDate', type: 'date' })
  invoicedate: Date;

  @Column({ name: 'TotalInvoice', type: 'money' })
  totalinvoice: number;

  @Column({ type: 'int' })
  publisherId: number;

  @Column({ type: 'int' })
  orderId: number;

  @ManyToOne(() => Publisher, (p) => p.invoices)
  publisher: Publisher;

  @OneToOne(() => Order, (o) => o.invoices)
  order: Order;
}
