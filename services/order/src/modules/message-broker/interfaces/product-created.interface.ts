import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IProductCreated {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
    name: string;
    price: number;
    version: number;
  };
}
