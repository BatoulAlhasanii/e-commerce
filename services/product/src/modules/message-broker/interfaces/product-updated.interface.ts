import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IProductUpdated {
  subject: Subjects.ProductUpdated;
  data: {
    id: string;
    name: string;
    price: number;
    version: number;
  };
}
