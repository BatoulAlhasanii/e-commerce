import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from '@/product/repositories/product.repository';
import { Product } from '@/product/entities/product.entity';
import { AuthUserPayload } from '@/auth/types';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    createProductDto: CreateProductDto,
    user: AuthUserPayload,
  ): Promise<Product> {
    const product: Product = this.productRepository.create({
      ...createProductDto,
      userId: user.id,
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOneByOrFail({ id });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: AuthUserPayload,
  ): Promise<Product> {
    const product: Product = await this.productRepository.findOneByOrFail({
      id,
    });

    if (product.userId != user.id) {
      throw new HttpException(
        'You are unauthorized to update product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.productRepository.update(id, updateProductDto);

    return await this.productRepository.findOneBy({ id });
  }

  async remove(id: string, user: AuthUserPayload): Promise<void> {
    const product: Product = await this.productRepository.findOneByOrFail({
      id,
    });

    if (product.userId != user.id) {
      throw new HttpException(
        'You are unauthorized to remove product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.productRepository.remove(product);
  }
}
