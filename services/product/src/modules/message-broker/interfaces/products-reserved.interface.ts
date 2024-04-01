import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { ICheckedOutCartItem } from '@/modules/message-broker/interfaces/cart-checked-out.interface';

export interface IProductsReserved {
  subject: Subjects.ProductsReserved;
  data: {
    userId: string;
    items: ICheckedOutCartItem[];
  };
}
