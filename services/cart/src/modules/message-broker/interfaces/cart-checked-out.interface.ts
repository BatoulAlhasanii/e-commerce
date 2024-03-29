import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface ICheckedOutCartItem {
  productId: string;
  quantity: number;
}

export interface ICartCheckedOut {
  subject: Subjects.CartCheckedOut;
  data: {
    items: ICheckedOutCartItem[];
  };
}
