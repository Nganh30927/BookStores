import {  Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Invoice } from './invoice.entity';
import { Book } from './book.entity';
import { Order } from './orders.entity';

@Entity({ name: 'Publishers' })
export class Publisher {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @MaxLength(100)
    @IsNotEmpty()
    @Column({name: 'Name', type: 'nvarchar', length: 500})

    @IsEmail()
    @IsNotEmpty()
    @Column({name: 'Email', type: 'nvarchar', length: 50, unique: true})
    email: string;

    @MaxLength(10)
    @IsNotEmpty()
    @Column({name: 'PhoneNumber', type: 'varchar', length: 10, unique: true})
    phonenumber: number;

    

    @OneToMany(() => Invoice, (i) => i.publisher)
    invoices: Invoice[];
    @OneToMany(() => Book, (b) => b.publisher)
    books: Book[];

    @OneToMany(() => Order, (o) => o.publisher)
    orders: Order[];
}