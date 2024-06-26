import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Member } from './member.entity';
import { Receipt } from './receipt.entity';
import { CartDetail } from './cartdetail.entity';

@Entity({ name: 'Carts' })
export class Cart {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @IsNotEmpty()
  @Column({ name: 'CartDate', type: 'datetime' })
  cartDate: Date;

  @IsNotEmpty()
  @MaxLength(50)
  @Column({ name: 'CartStatus', type: 'varchar', length: 50 })
  cartStatus: string;

  @Column({ name: 'CartTotal', type: 'int', nullable: true })
  cartTotal?: number;

  @Column({ type: 'int' })
  memberId: number;

  @ManyToOne(() => Member, (m) => m.carts)
  member: Member;

  @OneToOne(() => Receipt, (re) => re.cart)
  receipts: Receipt[];

  @OneToMany(() => CartDetail, (c) => c.cart)
  cartDetails: CartDetail[];
}