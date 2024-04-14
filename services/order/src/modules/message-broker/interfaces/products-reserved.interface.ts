import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface ICheckedOutCartItem {
  productId: string;
  quantity: number;
  availableQuantity?: number;
}

export interface IProductsReserved {
  subject: Subjects.ProductsReserved;
  data: {
    userId: string;
    items: ICheckedOutCartItem[];
  };
}
