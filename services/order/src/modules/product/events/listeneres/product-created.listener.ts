import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IProductCreated } from '@/modules/message-broker/interfaces/product-created.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductCreatedListener extends BaseEventListener<IProductCreated> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;

  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async handle(data: IProductCreated['data']): Promise<void> {
    const product: Product = this.productRepository.create({
      id: data.id,
      name: data.name,
      price: data.price,
    });

    await this.productRepository.save(product);
  }
}
