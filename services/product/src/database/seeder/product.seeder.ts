import { Injectable } from '@nestjs/common';
import { Factory } from '@/database/factories/factory';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { productDefinition } from '@/database/factories/product.factory';

@Injectable()
export class ProductSeeder {
  constructor(private productRepository: ProductRepository) {}

  async seed(): Promise<void> {
    await Factory.createMany(this.productRepository, productDefinition, 10);
  }
}
