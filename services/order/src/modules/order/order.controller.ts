import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderService } from '@/modules/order/order.service';
import { HasRole } from '@/modules/auth/decorators/has-role.decorator';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { OrderSerializer } from '@/modules/order/serializers/order.serializer';

@HasRole(UserRole.BUYER)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getUserOrders(@AuthUser() user): Promise<ApiResponse<OrderSerializer[]>> {
    const orders: Order[] = await this.orderService.getUserOrders(user);

    return responseSuccess(null, OrderSerializer.transformMany(orders));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthUser() user): Promise<ApiResponse<OrderSerializer>> {
    const order: Order = await this.orderService.findOne(id, user);

    return responseSuccess(null, OrderSerializer.transform(order));
  }
}
