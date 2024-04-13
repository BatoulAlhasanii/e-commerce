import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IProductDeleted } from '@/modules/message-broker/interfaces/product-deleted.interface';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductDeletedListener extends BaseEventListener<IProductDeleted> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;

  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async handle(data: IProductDeleted['data']): Promise<void> {
    const product: Product | null = await this.productRepository.findOneBy({
      id: data.id,
      version: data.version - 1,
    });

    if (!product) {
      throw Error('Product not found');
    }

    await this.productRepository.softDelete(product.id);
  }
}
