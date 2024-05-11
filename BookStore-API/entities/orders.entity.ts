import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Check } from 'typeorm';
import { IsNotEmpty, Max, MaxLength, max, validateOrReject } from 'class-validator';
import { Employee } from './employee.entity';
import { Invoice } from './invoice.entity';
import { OrderDetail } from './orderdetails.entity';
import { Member } from './member.entity';

@Entity({ name: 'Orders' })
//ShippedDay >= OrderDay
@Check(`"ShippedDay" >= "OrderDay"`)
export class Order {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @IsNotEmpty()
  @Column({ name: 'OrderDay', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  orderday: Date;

  @Column({ name: 'ShippedDay', type: 'datetime', nullable: true })
  shippedday: Date;

  @IsNotEmpty()
  @Column({ name: 'Status', type: 'varchar', length: 50, default: 'WAITING', enum: ['WAITING', 'COMPLETED', 'CANCELED'] })
  status: string;

  @MaxLength(500)
  @Column({ name: 'ShippingAddress', type: 'nvarchar', length: 500, nullable: true })
  shippingaddress: string;

  @IsNotEmpty()
  @Column({ name: 'PaymentType', type: 'varchar', length: 50, default: 'CASH', enum: ['CASH', 'CREDIT'] })
  paymenttype: string;

  @Column({ name: 'Description', type: 'nvarchar', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  employeeId: number;

  @Column({ type: 'int' })
  memberId: number;

  @ManyToOne(() => Employee, (e) => e.orders)
  employee: Employee;

  @ManyToOne(() => Member, (m) => m.orders)
  member: Member;

  @OneToMany(() => Invoice, (i) => i.order)
  invoices: Invoice[];

  @OneToMany(() => OrderDetail, (o) => o.order)
  orderDetails: OrderDetail[];
}
