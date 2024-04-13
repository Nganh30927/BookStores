import {  Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Member } from './member.entity';
import { Book } from './book.entity';

@Entity({ name: 'FeedBacks' })
export class FeedBack {
    @PrimaryGeneratedColumn({name: 'Id'})
    id: number;

    @MaxLength(500)
    @Column({name: 'FeedBackComment', type: 'nvarchar', length: 500, nullable: true})
    feedbackcomment: string;

    @Column({name: 'Rating', type: 'int', default: 0})
    rating: number;

    @Column({type: 'int'})
    bookId: number;

    @Column({type: 'int'})
    memberId: number

    @ManyToOne(() => Member, (m) => m.feedbacks)
    member: Member;

    @ManyToOne(() => Book, (b) => b.feedbacks)
    book: Book;

  
}