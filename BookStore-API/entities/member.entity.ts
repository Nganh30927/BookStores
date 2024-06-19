import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, MinLength, validateOrReject } from 'class-validator';
import { Cart } from './cart.entity';
import { FeedBack } from './feedback.entity';
import { Order } from './orders.entity';

@Entity({ name: 'Members' })
export class Member {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @MaxLength(50)
  @IsNotEmpty()
  @Column({ name: 'Name', type: 'nvarchar', length: 50 })
  name: string;

  @MaxLength(500)
  @IsNotEmpty()
  @Column({ name: 'Address', type: 'nvarchar', length: 500 })
  address: string;

  @IsNotEmpty()
  @Column({ name: 'Gender', type: 'nvarchar', enum: ['Male', 'Female', 'Others']})
  gender: string;

  @MaxLength(10)
  @IsNotEmpty()
  @Column({ name: 'Contact', type: 'varchar', unique: true, length: 10 })
  contact: string;

  @MinLength(8)
  @Column({name: 'Password', type: 'nvarchar', nullable: true})
  password?: string;

  @IsEmail()
  @Column({name: 'Email', type: 'nvarchar', unique: true, nullable: true})
  email?: string;

  @OneToMany(() => Cart, (c) => c.member)
  carts: Cart[];

  @OneToMany(() => FeedBack, (f) => f.member)
  feedbacks: FeedBack[];

  @OneToMany(() => Order, (o) => o.member)
  orders: Order[];
}