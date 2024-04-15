import { BaseEntity, BeforeInsert, BeforeUpdate, Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsEmail, MaxLength, validateOrReject } from 'class-validator';
import { Order } from './orders.entity';

@Entity({ name: 'Employees' })
export class Employee {
    @PrimaryGeneratedColumn({ name: 'Id' })
    id: number;

    @MaxLength(50)
    @IsNotEmpty()
    @Column({ name: 'Name', type: 'nvarchar', length: 50 })
    name: string;

    @MaxLength(10)
    @IsNotEmpty()
    @Column({ name: 'PhoneNumber', type: 'varchar', length: 10, unique: true })
    phonenumber: number;

    @IsEmail()
    @IsNotEmpty()
    @Column({ name: 'Email', type: 'nvarchar', length: 50, unique: true })
    email: string;

    @MaxLength(500)
    @IsNotEmpty()
    @Column({ name: 'Address', type: 'nvarchar', length: 500 })
    address: string;

    @IsNotEmpty()
    @Column({ name: 'Gender', type: 'nvarchar', enum: ['Male', 'Female', 'Others'] })
    gender: string;

    @IsNotEmpty()
    @Column({ name: 'Position', type: 'varchar', default: 'Staff' })
    position: string;

    @Column({ name: 'BirthDay', type: 'date', nullable: true })
    birthday: Date;


    @OneToMany(() => Order, (o) => o.employee)
    orders: Order[];
}