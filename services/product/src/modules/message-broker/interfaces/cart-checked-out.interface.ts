import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface ICheckedOutCartItem {
  productId: string;
  quantity: number;
  availableQuantity?: number;
}

export interface ICartCheckedOut {
  subject: Subjects.CartCheckedOut;
  data: {
    userId: string;
    items: ICheckedOutCartItem[];
  };
}
