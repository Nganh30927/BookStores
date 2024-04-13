import {  Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Publisher } from './publisher.entity';
import { Order } from './orders.entity';


@Entity({ name: 'Invoices' })
export class Invoice {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @Column({name: 'InvoiceDate', type: 'datetime'})
    invoicedate: Date;

    @Column({name: 'TotalInvoice', type: 'money'})
    totalinvoice: number;

    @Column({type: 'int'})
    publisherId: number;

    @Column({type: 'int'})
    orderId: number;

    @ManyToOne(() => Publisher, (p) => p.invoices)
    publisher: Publisher;

    @ManyToOne(() => Order, (o) => o.invoices)
    order: Order;

    
    
}