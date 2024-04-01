import { ICheckedOutCartItem } from '@/modules/message-broker/interfaces/cart-checked-out.interface';

export interface IItemAvailabilityGroups {
  notFoundItems: ICheckedOutCartItem[];
  unAvailableItems: ICheckedOutCartItem[];
  insufficientQuantityItems: ICheckedOutCartItem[];
  availableItems: ICheckedOutCartItem[];
}
