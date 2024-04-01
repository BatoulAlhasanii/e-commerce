import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IItemAvailabilityGroups } from '@/modules/product/interfaces/item-availability-groups.interface';

export interface IProductsReservationFailed {
  subject: Subjects.ProductsReservationFailed;
  data: {
    userId: string;
    itemAvailabilityGroups: IItemAvailabilityGroups;
  };
}
