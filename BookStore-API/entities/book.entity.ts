import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmpty, IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Publisher } from './publisher.entity';
import { Category } from './category.entity';
import { CartDetail } from './cartdetail.entity';
import { FeedBack } from './feedback.entity';
import { OrderDetail } from './orderdetails.entity';

@Entity({ name: 'Books' })
@Check(`"Quantity" >= 0`)
@Check(`"Price" >= 0`)
@Check(`"Discount" >= 0`)
@Check(`"Discount" <= 100`)
export class Book {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @MaxLength(100)
  @IsNotEmpty()
  @Column({ name: 'Name', type: 'nvarchar', length: 100 })
  name: string;

  @MaxLength(100)
  @Column({ name: 'Author', type: 'nvarchar', length: 100, nullable: true })
  author?: string;

  @MaxLength(500)
  @Column({ name: 'Title', type: 'nvarchar', length: 500, nullable: true })
  title?: string;

  @IsNotEmpty()
  @Column({ name: 'Quantity', type: 'int', default: 0 })
  quantity: number;

  @IsNotEmpty()
  @Column({ name: 'Price', type: 'money' })
  price: number;

  @IsNotEmpty()
  @Column({ name: 'SerialNumber', type: 'decimal', precision: 18, scale: 2 })
  serialnumber: number;

  @MaxLength(500)
  @Column({ name: 'Description', type: 'nvarchar', length: 500, nullable: true })
  description?: string;

  @IsNotEmpty()
  @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discount: number;

  @MaxLength(500)
  @IsNotEmpty()
  @Column({ name: 'ImageURL', type: 'nvarchar', length: 500, nullable: true })
  imageURL?: string;

  @MaxLength(500)
  @Column({ name: 'Slug', type: 'nvarchar', length: 500, nullable: true })
  slug?: string;

  @Column({ type: 'int' })
  publisherId: number;

  @Column({ type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.books)
  category: Category;

  @ManyToOne(() => Publisher, (p) => p.books)
  publisher: Publisher;

  @OneToMany(() => CartDetail, (c) => c.book)
  cartDetails: CartDetail[];

  @OneToMany(() => FeedBack, (f) => f.book)
  feedbacks: FeedBack[];

  @OneToMany(() => OrderDetail, (o) => o.book)
  orderDetails: OrderDetail[];
}