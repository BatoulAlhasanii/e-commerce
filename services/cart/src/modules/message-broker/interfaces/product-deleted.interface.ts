import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IProductDeleted {
  subject: Subjects.ProductDeleted;
  data: {
    id: string;
    version: number;
  };
}
