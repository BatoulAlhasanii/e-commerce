import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Injectable } from '@nestjs/common';
import { ICheckedOutCartItem, IProductsReserved } from '@/modules/message-broker/interfaces/products-reserved.interface';
import { Order } from '@/modules/order/entities/order.entity';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { DataSource, In, QueryRunner } from 'typeorm';
import { Product } from '@/modules/product/entities/product.entity';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { OrderCreatedPublisher } from '@/modules/order/events/publishers/order-created.publisher';

@Injectable()
export class ProductsReservedListener extends BaseEventListener<IProductsReserved> {
  subject: Subjects.ProductsReserved = Subjects.ProductsReserved;

  constructor(
    private readonly dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly orderCreatedPublisher: OrderCreatedPublisher,
  ) {
    super();
  }

  async handle(data: IProductsReserved['data']): Promise<void> {
    const productIds: string[] = data.items.map((item: ICheckedOutCartItem) => item.productId);

    const storedProducts: Product[] = await this.getStoredProducts(productIds);

    const storedProductsMap: { [productId: string]: Product } = this.mapStoredProductsByIds(storedProducts);

    const total: number = this.calculateTotal(data.items, storedProductsMap);

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const order: Order = await this.createOrder(queryRunner, data.userId, total);

      await this.createOrderItems(data.items, queryRunner, storedProductsMap, order);

      await queryRunner.commitTransaction();

      await this.orderCreatedPublisher.publish({
        id: order.id,
        userId: order.userId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async getStoredProducts(productIds: string[]) {
    return await this.productRepository.find({
      where: {
        id: In(productIds),
      },
      withDeleted: true,
    });
  }

  private mapStoredProductsByIds(storedProducts: Product[]) {
    return storedProducts.reduce((map, product: Product) => {
      map[product.id] = product;
      return map;
    }, {});
  }

  private calculateTotal(cartItems: ICheckedOutCartItem[], storedProductsMap: { [p: string]: Product }) {
    return cartItems.reduce((total: number, item: ICheckedOutCartItem) => {
      total += item.quantity * storedProductsMap[item.productId].price;
      return total;
    }, 0);
  }

  private async createOrder(queryRunner: QueryRunner, userId: string, total: number) {
    const order: Order = queryRunner.manager.create(Order, {
      userId,
      total,
    });

    return await queryRunner.manager.save(Order, order);
  }

  private async createOrderItems(cartItems: ICheckedOutCartItem[], queryRunner: QueryRunner, storedProductsMap: { [p: string]: Product }, order: Order) {
    const orderItems: OrderItem[] = cartItems.map((item: ICheckedOutCartItem) =>
      queryRunner.manager.create(OrderItem, {
        productId: item.productId,
        quantity: item.quantity,
        price: storedProductsMap[item.productId].price,
        orderId: order.id,
      }),
    );

    await queryRunner.manager.save(OrderItem, orderItems);
  }
}
