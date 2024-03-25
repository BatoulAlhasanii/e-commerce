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
import { ProductService } from '@/modules/product/product.service';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { AuthUserPayload } from '@/modules/auth/types';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductSerializer } from '@/modules/product/serializers/product.serializer';
import { HasRole } from '@/modules/auth/decorators/has-role.decorator';
import { UserRole } from '@/modules/auth/enums/user-role.enum';

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
