import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Book } from './book.entity';


@Entity({ name: 'Categories' })
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @MaxLength(100)
    @IsNotEmpty()
    @Column({name: 'Name', type: 'nvarchar', length: 100})
    name: string;

    @MaxLength(500)
    @Column({name: 'Description', type: 'nvarchar', length: 500, nullable: true})
    description?: string;


    @OneToMany(() => Book, (b) => b.category)
    books: Book[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}