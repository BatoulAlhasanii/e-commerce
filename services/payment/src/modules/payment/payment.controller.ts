import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { PaymentService } from '@/modules/payment/payment.service';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { AuthUserPayload } from '@/modules/auth/types';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { PaymentSerializer } from '@/modules/payment/serializers/payment.serializer';
import { HasRole } from '@/modules/auth/decorators/has-role.decorator';
import { UserRole } from '@/modules/auth/enums/user-role.enum';

@HasRole(UserRole.BUYER)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('order/:orderId')
  async getPaymentByOrder(@Param('orderId') orderId: string, @AuthUser() user: AuthUserPayload) {
    const payment: Payment = await this.paymentService.getPaymentByOrder(orderId, user);

    return responseSuccess(null, PaymentSerializer.transform(payment));
  }

  @Post('confirm/order/:orderId')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(@Param('orderId') orderId: string, @AuthUser() user: AuthUserPayload): Promise<ApiResponse<{ paymentHasSucceeded: true | false }>> {
    return responseSuccess(null, await this.paymentService.confirmPayment(orderId, user));
  }
}
