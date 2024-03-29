import { IItem } from '@/modules/cart/interfaces/item.interface';

export interface ICart {
  total: number;
  items: IItem[];
}
