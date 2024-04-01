import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { AuthUserPayload } from '@/modules/auth/types';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { ProductCreatedPublisher } from '@/modules/product/events/publishers/product-created.publisher';
import { ProductUpdatedPublisher } from '@/modules/product/events/publishers/product-updated.publisher';
import { ProductDeletedPublisher } from '@/modules/product/events/publishers/product-deleted.publisher';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(MESSAGE_BROKER) private readonly messageBroker: IMessageBroker,
    private readonly productCreatedPublisher: ProductCreatedPublisher,
    private readonly productUpdatedPublisher: ProductUpdatedPublisher,
    private readonly productDeletedPublisher: ProductDeletedPublisher,
  ) {}

  async create(createProductDto: CreateProductDto, user: AuthUserPayload): Promise<Product> {
    let product: Product = this.productRepository.create({
      ...createProductDto,
      userId: user.id,
    });

    product = await this.productRepository.save(product);

    await this.productCreatedPublisher.publish({
      id: product.id,
      name: product.name,
      price: product.price,
      version: product.version,
    });

    return product;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: AuthUserPayload): Promise<Product> {
    let product: Product = await this.productRepository.findOneByOrFail({
      id,
    });

    if (product.userId != user.id) {
      throw new HttpException('You are unauthorized to update product', HttpStatus.UNAUTHORIZED);
    }

    await this.productRepository.update(id, updateProductDto);

    product = await this.productRepository.findOneBy({ id });

    await this.productUpdatedPublisher.publish({
      id: product.id,
      name: product.name,
      price: product.price,
      version: product.version,
    });

    return product;
  }

  async remove(id: string, user: AuthUserPayload): Promise<void> {
    const product: Product = await this.productRepository.findOneByOrFail({
      id,
    });

    if (product.userId != user.id) {
      throw new HttpException('You are unauthorized to remove product', HttpStatus.UNAUTHORIZED);
    }

    if (product.reservedQuantity != 0) {
      throw new HttpException('You cannot remove reserved product', HttpStatus.BAD_REQUEST);
    }

    await this.productRepository.softDelete(product.id);

    await this.productDeletedPublisher.publish({
      id: id,
      version: product.version + 1,
    });
  }
}
