import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Cart } from './cart.entity';
import { FeedBack } from './feedback.entity';

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
    @Column({ name: 'Gender', type: 'nvarchar', enum: ['Male', 'Female', 'Others'] })
    gender: string;

    @MaxLength(10)
    @IsNotEmpty()
    @Column({ name: 'Contact', type: 'nvarchar', unique: true, length: 10 })
    contact: number;



    @OneToOne(() => Cart, (c) => c.member)
    cart: Cart;

    @OneToMany(() => FeedBack, (f) => f.member)
    feedbacks: FeedBack[]

}