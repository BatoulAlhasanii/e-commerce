import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IProductUpdated } from '@/modules/message-broker/interfaces/product-updated.interface';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductUpdatedListener extends BaseEventListener<IProductUpdated> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;

  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async handle(data: IProductUpdated['data']): Promise<void> {
    const product: Product | null = await this.productRepository.findOneBy({
      id: data.id,
      version: data.version - 1,
    });

    if (!product) {
      throw Error('Product not found');
    }

    await this.productRepository.update(product.id, {
      name: data.name,
      price: data.price,
    });
  }
}
