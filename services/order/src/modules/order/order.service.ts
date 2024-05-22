import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { AuthUserPayload } from '@/modules/auth/types';
import { Order } from '@/modules/order/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getUserOrders(user: AuthUserPayload) {
    return await this.orderRepository.find({
      where: { userId: user.id },
      relations: ['items.product'],
    });
  }

  async findOne(id: string, user: AuthUserPayload) {
    const order: Order = await this.orderRepository.findOneOrFail({
      where: { id },
      relations: ['items.product'],
    });

    if (order.userId != user.id) {
      throw new HttpException('You are not allowed to view the order', HttpStatus.UNAUTHORIZED);
    }

    return order;
  }
}
