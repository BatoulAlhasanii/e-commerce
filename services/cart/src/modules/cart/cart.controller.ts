import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import { AddItemDto } from '@/modules/cart/dto/add-item.dto';
import { UpdateItemDto } from '@/modules/cart/dto/update-item.dto';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { AuthUserPayload } from '@/modules/auth/types';
import { RemoveItemParamDto } from '@/modules/cart/dto/remove-item-param.dto';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { ICart } from '@/modules/cart/interfaces/cart.interface';
import { UpdateItemParamDto } from '@/modules/cart/dto/update-item-param.dto';

@UseGuards(JWTAuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put('/add-item')
  async addItem(
    @Body() addItemDto: AddItemDto,
    @AuthUser() user: AuthUserPayload,
  ): Promise<ApiResponse<ICart>> {
    return responseSuccess(
      'Item added successfully',
      await this.cartService.addItem(addItemDto, user),
    );
  }

  @Get()
  async get(@AuthUser() user: AuthUserPayload): Promise<ApiResponse<ICart>> {
    return responseSuccess(null, await this.cartService.getCart(user));
  }

  @Put('/update-item/:productId')
  async updateItem(
    @Param() updateItemParamDto: UpdateItemParamDto,
    @Body() updateItemDto: UpdateItemDto,
    @AuthUser() user: AuthUserPayload,
  ) {
    return responseSuccess(
      'Item updated successfully',
      await this.cartService.updateItem(
        updateItemParamDto,
        updateItemDto,
        user,
      ),
    );
  }

  @Put('/remove-item/:productId')
  async removeItem(
    @Param() removeItemParamDto: RemoveItemParamDto,
    @AuthUser() user: AuthUserPayload,
  ) {
    return responseSuccess(
      'Item removed successfully',
      await this.cartService.removeItem(removeItemParamDto, user),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@AuthUser() user: AuthUserPayload): Promise<void> {
    await this.cartService.remove(user);

    return;
  }
}
