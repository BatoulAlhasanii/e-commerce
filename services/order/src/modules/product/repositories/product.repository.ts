import { Repository } from 'typeorm';
import { EntityRepository } from '@/database/typeorm/typeorm-entity-repository.decorator';
import { Product } from '@/modules/product/entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
