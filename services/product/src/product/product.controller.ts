import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { AuthUserPayload } from '@/auth/types';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { Product } from '@/product/entities/product.entity';
import { ProductSerializer } from '@/product/serializers/product.serializer';
import { HasRole } from '@/auth/decorators/has-role.decorator';
import { UserRole } from '@/auth/enums/user-role.enum';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HasRole(UserRole.SELLER)
  async create(
    @Body() createProductDto: CreateProductDto,
    @AuthUser() user: AuthUserPayload,
  ): Promise<ApiResponse<ProductSerializer>> {
    const product: Product = await this.productService.create(
      createProductDto,
      user,
    );

    return responseSuccess(
      'Product created successfully',
      ProductSerializer.transform(product),
    );
  }

  @Get()
  async findAll(): Promise<ApiResponse<ProductSerializer[]>> {
    const products: Product[] = await this.productService.findAll();

    return responseSuccess(
      'Product created successfully',
      ProductSerializer.transformMany(products),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<ProductSerializer>> {
    const product: Product = await this.productService.findOne(id);

    return responseSuccess(null, ProductSerializer.transform(product));
  }

  @Put(':id')
  @HasRole(UserRole.SELLER)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @AuthUser() user: AuthUserPayload,
  ): Promise<ApiResponse<ProductSerializer>> {
    const product: Product = await this.productService.update(
      id,
      updateProductDto,
      user,
    );

    return responseSuccess(
      'Product updated successfully',
      ProductSerializer.transform(product),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @HasRole(UserRole.SELLER)
  async remove(
    @Param('id') id: string,
    @AuthUser() user: AuthUserPayload,
  ): Promise<ApiResponse<null>> {
    await this.productService.remove(id, user);

    return responseSuccess();
  }
}
