import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmpty, IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import {Publisher} from './publisher.entity';
import {Category} from './category.entity'
import { CartDetail } from './cartdetail.entity';
import { FeedBack } from './feedback.entity';
import { OrderDetail } from './orderdetails.entity';

@Entity({ name: 'Books' })
export class Book {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @MaxLength(100)
    @IsNotEmpty()
    @Column({name: 'Name', type: 'nvarchar', length: 100})
    name: string;

    @MaxLength(500)
    @Column({name: 'Title', type: 'nvarchar', length: 500, nullable: true})
    title?: string;

    @IsNotEmpty()
    @Column({name: 'Quantity', type: 'decimal', precision: 18, scale: 2 })
    quantity: number;

    @IsNotEmpty()
    @Column({name: 'Price', type: 'money'})
    price: number;
    
    @IsNotEmpty()
    @Column({name: 'SerialNumber', type: 'decimal', precision: 18, scale: 2 })
    serialnumber: number;

    @MaxLength(500)
    @Column({name: 'Description',  type: 'nvarchar', length: 500, nullable: true})
    description?: string;

    @IsNotEmpty()
    @Column({name: 'Discount', type: 'decimal', precision: 18, scale: 2 })
    discount: number;

    @MaxLength(500)
    @IsNotEmpty()
    @Column({name: 'ImageURL', type: 'nvarchar', length: 500, nullable: true})
    imageURL?: string;

    @MaxLength(500)
    @Column({name: 'Slug', type: 'nvarchar', length: 500, nullable: true})
    slug?: string;

    @Column({type: 'int'})
    publisherId: number;

    @Column({type: 'int'})
    categoryId: number; 

   
    @ManyToOne(() => Category, (c) => c.books)
    category: Category;

    @ManyToOne(() => Publisher, (p) => p.books)
    publisher: Publisher;

    @ManyToOne(() => CartDetail, (c) => c.books)
    cartDetail: CartDetail;

    @OneToMany(() => FeedBack, (f) => f.book)
    feedbacks: FeedBack[];

    @ManyToMany(() => OrderDetail)
    @JoinTable()
    orderDetails: OrderDetail[];

}