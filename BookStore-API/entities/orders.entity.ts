import {  Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Publisher } from './publisher.entity';
import { Employee } from './employee.entity';
import { Invoice } from './invoice.entity';
import { OrderDetail } from './orderdetails.entity';

@Entity({ name: 'Orders' })
export class Order {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @IsNotEmpty()
    @Column({name: 'OrderDay', type: 'datetime'})
    orderday: Date;

    @Column({name: 'ShippedDay', type: 'datetime', nullable: true})
    shippedday: Date;

    @IsNotEmpty()
    @Column({name: 'Status', type: 'varchar', length: 50, default: 'WAITING'})
    status: string;

    @MaxLength(500)
    @IsNotEmpty()
    @Column({name: 'ShippingAddress', type: 'nvarchar', length: 500})
    shippingaddress: string;

    @IsNotEmpty()
    @Column({name: 'PaymentType', type: 'varchar', length: 50, default: 'CASH'})
    paymenttype: string;

    @Column({type: 'int'})
    publisherId: number;

    @Column({type: 'int'})
    employeId: number;

   

    @ManyToOne(() => Employee, (e) => e.orders)
    employee: Employee;

    @OneToMany(() => Invoice, (i) => i.order)
    invoices: Invoice[];

    @OneToMany(() => OrderDetail, (o) => o.order)
    orderDetails: OrderDetail[];

    @ManyToOne(() => Publisher, (p) => p.orders)
    publisher: Publisher;
 
}