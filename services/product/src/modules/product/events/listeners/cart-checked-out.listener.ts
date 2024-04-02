import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { ICartCheckedOut, ICheckedOutCartItem } from '@/modules/message-broker/interfaces/cart-checked-out.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Product } from '@/modules/product/entities/product.entity';
import { DataSource, In, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IItemAvailabilityGroups } from '@/modules/product/interfaces/item-availability-groups.interface';
import { ProductsReservedPublisher } from '@/modules/product/events/publishers/products-reserved.publisher';
import { ProductsReservationFailedPublisher } from '@/modules/product/events/publishers/products-reservation-failed.publisher';

@Injectable()
export class CartCheckedOutListener extends BaseEventListener<ICartCheckedOut> {
  subject: Subjects.CartCheckedOut = Subjects.CartCheckedOut;

  constructor(
    private readonly dataSource: DataSource,
    private readonly productsReservedPublisher: ProductsReservedPublisher,
    private readonly productsReservationFailedPublisher: ProductsReservationFailedPublisher,
  ) {
    super();
  }

  async handle(data: ICartCheckedOut['data']): Promise<void> {
    const productIds: string[] = data.items.map((item: ICheckedOutCartItem) => item.productId);

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    let itemAvailabilityGroups: IItemAvailabilityGroups;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const storedProducts: Product[] = await this.getStoredProducts(queryRunner, productIds);

      const storedProductsMap: { [productId: string]: Product } = this.mapStoredProductsByIds(storedProducts);

      itemAvailabilityGroups = this.groupItemsByAvailability(data.items, storedProductsMap);

      if (data.items.length == itemAvailabilityGroups.availableItems.length) {
        await this.updateProductsStock(data.items, storedProductsMap, queryRunner);
      } else {
        throw new Error('Not all items are available');
      }

      await queryRunner.commitTransaction();

      await this.productsReservedPublisher.publish({
        userId: data.userId,
        items: data.items,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();

      await this.productsReservationFailedPublisher.publish({
        userId: data.userId,
        itemAvailabilityGroups: itemAvailabilityGroups,
      });
    } finally {
      await queryRunner.release();
    }
  }

  private async getStoredProducts(queryRunner: QueryRunner, productIds: string[]) {
    return await queryRunner.manager.find(Product, {
      where: {
        id: In(productIds),
      },
      withDeleted: true,
    });
  }

  private mapStoredProductsByIds(storedProducts: Product[]) {
    return storedProducts.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
  }

  private groupItemsByAvailability(items: ICheckedOutCartItem[], storedProductsMap: { [productId: string]: Product }): IItemAvailabilityGroups {
    const itemAvailabilityGroups: IItemAvailabilityGroups = {
      notFoundItems: [],
      unAvailableItems: [],
      insufficientQuantityItems: [],
      availableItems: [],
    };

    for (const item of items) {
      const storedProduct: Product | undefined = storedProductsMap[item.productId];

      if (!storedProduct) {
        itemAvailabilityGroups.notFoundItems.push(item);
        continue;
      }

      if (storedProduct.deletedAt) {
        itemAvailabilityGroups.unAvailableItems.push(item);
        continue;
      }

      if (storedProduct.stock < item.quantity) {
        itemAvailabilityGroups.insufficientQuantityItems.push({
          ...item,
          availableQuantity: storedProduct.stock,
        });
        continue;
      }

      itemAvailabilityGroups.availableItems.push(item);
    }

    return itemAvailabilityGroups;
  }

  private async updateProductsStock(
    items: ICheckedOutCartItem[],
    storedProductsMap: { [productId: string]: Product },
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const item of items) {
      const product: Product = storedProductsMap[item.productId];

      await queryRunner.manager.update(
        Product,
        { id: product.id },
        {
          stock: () => `stock - ${item.quantity}`,
          reservedQuantity: () => `reservedQuantity + ${item.quantity}`,
        },
      );
    }
  }
}
