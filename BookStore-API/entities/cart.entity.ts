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

    @IsNotEmpty()
    @Column({ name: 'CartTotal', type: 'int' })
    cartTotal: number;

    @Column({ type: 'int' })
    memberId: number;



    @OneToOne(() => Member, (m) => m.cart)
    member: Member;

    @OneToOne(() => Receipt, (re) => re.cart)
    receipt: Receipt;

    @OneToMany(() => CartDetail, (c) => c.cart)
    cartDetails: CartDetail[];

}