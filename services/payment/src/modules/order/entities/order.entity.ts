import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';

@Entity()
export class Order {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
