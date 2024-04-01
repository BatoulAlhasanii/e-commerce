import { EntitySerializer } from '@/utils/entity-serializer';
import { Product } from '@/modules/product/entities/product.entity';

export class ProductSerializer extends EntitySerializer<Product> {
  id: string;
  name: string;
  stock: number;
  reservedQuantity: number;
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Product) {
    super();
    this.id = entity.id;
    this.name = entity.name;
    this.stock = entity.stock;
    this.reservedQuantity = entity.reservedQuantity;
    this.price = entity.price;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
