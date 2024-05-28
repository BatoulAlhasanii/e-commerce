import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { faker } from '@faker-js/faker';
import {AppFactory} from "../../../factories/app";
import {OrderUpdatedListener} from "@/modules/product/events/listeners/order-updated.listener";
import {OrderStatus} from "@/modules/order/enums/order-status.enum";
import {IOrderUpdated} from "@/modules/message-broker/interfaces/order-updated.interface";

describe('OrderUpdatedListener', () => {
    let app: AppFactory;
    let productRepository: ProductRepository;
    let messageBroker: IMessageBroker;
    let orderUpdatedListener: OrderUpdatedListener;

    beforeAll(async () => {
        app = await AppFactory.new();

        productRepository = app.instance.get(ProductRepository);

        messageBroker = app.instance.get(MESSAGE_BROKER);

        orderUpdatedListener = app.instance.get(OrderUpdatedListener);
    });

    afterEach(async () => {
        await app.cleanupDB();

        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('tests retrieving reserved products on canceled order', async () => {
        const products: Product[] = await Factory.createMany(productRepository, productDefinition, 2, {
            stock: 0,
            reservedQuantity: 3
        });

        const data: IOrderUpdated['data'] = {
            id: faker.string.uuid(),
            status: OrderStatus.Canceled,
            items: [
                {
                    productId: products[0].id,
                    quantity: 1,
                },
                {
                    productId: products[1].id,
                    quantity: 3,
                },
            ],
            version: 1
        };

        await orderUpdatedListener.handle(data);

        const storedProducts: Product[] = await productRepository.find();

        expect(storedProducts[0].stock).toEqual(1);
        expect(storedProducts[0].reservedQuantity).toEqual(2);
        expect(storedProducts[1].stock).toEqual(3);
        expect(storedProducts[1].reservedQuantity).toEqual(0);
    });

    it('tests retrieving reserved products on order which has timeout payment', async () => {
        const products: Product[] = await Factory.createMany(productRepository, productDefinition, 2, {
            stock: 0,
            reservedQuantity: 3
        });

        const data: IOrderUpdated['data'] = {
            id: faker.string.uuid(),
            status: OrderStatus.PaymentTimeout,
            items: [
                {
                    productId: products[0].id,
                    quantity: 1,
                },
                {
                    productId: products[1].id,
                    quantity: 3,
                },
            ],
            version: 1
        };

        await orderUpdatedListener.handle(data);

        const storedProducts: Product[] = await productRepository.find();

        expect(storedProducts[0].stock).toEqual(1);
        expect(storedProducts[0].reservedQuantity).toEqual(2);
        expect(storedProducts[1].stock).toEqual(3);
        expect(storedProducts[1].reservedQuantity).toEqual(0);
    });

    it('tests retrieving reserved products on paid order', async () => {
        const products: Product[] = await Factory.createMany(productRepository, productDefinition, 2, {
            stock: 0,
            reservedQuantity: 3
        });

        const data: IOrderUpdated['data'] = {
            id: faker.string.uuid(),
            status: OrderStatus.Paid,
            items: [
                {
                    productId: products[0].id,
                    quantity: 1,
                },
                {
                    productId: products[1].id,
                    quantity: 3,
                },
            ],
            version: 1
        };

        await orderUpdatedListener.handle(data);

        const storedProducts: Product[] = await productRepository.find();

        expect(storedProducts[0].stock).toEqual(0);
        expect(storedProducts[0].reservedQuantity).toEqual(2);
        expect(storedProducts[1].stock).toEqual(0);
        expect(storedProducts[1].reservedQuantity).toEqual(0);
    });
});
