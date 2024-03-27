import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IEvent {
  subject: Subjects;
  data: any;
}
