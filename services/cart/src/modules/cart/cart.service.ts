import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddItemDto } from '@/modules/cart/dto/add-item.dto';
import { UpdateItemDto } from '@/modules/cart/dto/update-item.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AuthUserPayload } from '@/modules/auth/types';
import { ICart } from '@/modules/cart/interfaces/cart.interface';
import { IItem } from '@/modules/cart/interfaces/item.interface';
import { RemoveItemParamDto } from '@/modules/cart/dto/remove-item-param.dto';
import { UpdateItemParamDto } from '@/modules/cart/dto/update-item-param.dto';
import { ICheckedOutCartItem } from '@/modules/message-broker/interfaces/cart-checked-out.interface';
import { CartCheckedOutPublisher } from '@/modules/cart/events/publishers/cart-checked-out.publisher';

@Injectable()
export class CartService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly cartCheckedOutPublisher: CartCheckedOutPublisher,
  ) {}

  async addItem(addItemDto: AddItemDto, user: AuthUserPayload): Promise<ICart> {
    let cart: ICart | null = await this.getCart(user);

    if (
      cart?.items.find(
        (item: IItem): boolean => item.productId == addItemDto.productId,
      )
    ) {
      throw new HttpException(
        'Item is already added to cart',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!cart) {
      cart = { items: [], total: 0 };
    }

    const item: IItem = { ...addItemDto };

    cart.items.push(item);
    cart.total += addItemDto.productPrice * addItemDto.quantity;

    await this.redis.set(user.id, JSON.stringify(cart));

    return cart;
  }

  async getCart(user: AuthUserPayload): Promise<ICart | null> {
    const cartString: string = await this.redis.get(user.id);

    return JSON.parse(cartString);
  }

  async updateItem(
    updateItemParamDto: UpdateItemParamDto,
    updateItemDto: UpdateItemDto,
    user: AuthUserPayload,
  ): Promise<ICart> {
    const cart: ICart | null = await this.getCart(user);

    const itemIndex: number | null = cart?.items.findIndex(
      (item: IItem): boolean => item.productId == updateItemParamDto.productId,
    );

    if (!itemIndex || itemIndex == -1) {
      throw new HttpException("Item doesn't exist", HttpStatus.BAD_REQUEST);
    }

    cart.items[itemIndex].quantity = updateItemDto.quantity;
    cart.total = cart.items.reduce(
      (res: number, item: IItem) => res + item.productPrice * item.quantity,
      0,
    );

    await this.redis.set(user.id, JSON.stringify(cart));

    return cart;
  }

  async removeItem(
    removeItemParamDto: RemoveItemParamDto,
    user: AuthUserPayload,
  ): Promise<ICart> {
    const cart: ICart | null = await this.getCart(user);

    const itemIndex: number | null = cart?.items.findIndex(
      (item: IItem): boolean => item.productId == removeItemParamDto.productId,
    );

    if (!itemIndex || itemIndex == -1) {
      throw new HttpException("Item doesn't exist", HttpStatus.BAD_REQUEST);
    }

    cart.items.splice(itemIndex, 1);
    cart.total = cart.items.reduce(
      (res: number, item: IItem) => res + item.productPrice * item.quantity,
      0,
    );

    await this.redis.set(user.id, JSON.stringify(cart));

    return cart;
  }

  async remove(user: AuthUserPayload): Promise<void> {
    const cart: ICart | null = await this.getCart(user);

    if (!cart) {
      throw new HttpException("Cart doesn't exist", HttpStatus.BAD_REQUEST);
    }

    await this.redis.del(user.id);

    return;
  }

  async checkout(user: AuthUserPayload): Promise<void> {
    const cart: ICart | null = await this.getCart(user);

    if (!cart || cart.items.length == 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    await this.redis.del(user.id);

    const items: ICheckedOutCartItem[] = cart.items.map(
      (item: IItem): ICheckedOutCartItem => ({
        productId: item.productId,
        quantity: item.quantity,
      }),
    );

    await this.cartCheckedOutPublisher.publish({ userId: user.id, items });
  }
}
