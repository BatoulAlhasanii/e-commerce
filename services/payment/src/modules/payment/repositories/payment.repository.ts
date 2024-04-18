import { Repository } from 'typeorm';
import { EntityRepository } from '@/database/typeorm/typeorm-entity-repository.decorator';
import { Payment } from '@/modules/payment/entities/payment.entity';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
