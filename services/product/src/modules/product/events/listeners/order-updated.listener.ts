import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { ICheckedOutCartItem } from '@/modules/message-broker/interfaces/cart-checked-out.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Product } from '@/modules/product/entities/product.entity';
import { DataSource, In, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {IOrderUpdated} from "@/modules/message-broker/interfaces/order-updated.interface";
import {OrderStatus} from "@/modules/order/enums/order-status.enum";

@Injectable()
export class OrderUpdatedListener extends BaseEventListener<IOrderUpdated> {
    subject: Subjects.OrderUpdated = Subjects.OrderUpdated;

    constructor(
        private readonly dataSource: DataSource,
    ) {
        super();
    }

    async handle(data: IOrderUpdated['data']): Promise<void> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            if (data.status == OrderStatus.Paid) {
                await this.deductProductsReservedQuantity(data.items, queryRunner);
            } else {
                await this.retrieveReservedProducts(data.items, queryRunner);
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async deductProductsReservedQuantity(
        items: ICheckedOutCartItem[],
        queryRunner: QueryRunner,
    ): Promise<void> {
        for (const item of items) {
            await queryRunner.manager.update(
                Product,
                { id: item.productId },
                {
                    reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
                },
            );
        }
    }

    private async retrieveReservedProducts(
        items: ICheckedOutCartItem[],
        queryRunner: QueryRunner,
    ): Promise<void> {
        for (const item of items) {
            await queryRunner.manager.update(
                Product,
                { id: item.productId },
                {
                    stock: () => `stock + ${item.quantity}`,
                    reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
                },
            );
        }
    }
}
