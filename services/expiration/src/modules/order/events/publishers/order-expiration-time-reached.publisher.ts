import {BaseEventPublisher} from "@/modules/message-broker/events/publishers/base-event.publisher";
import {IOrderExpirationTimeReached} from "@/modules/message-broker/interfaces/order-expiration-time-reached.interface";
import {Subjects} from "@/modules/message-broker/enums/subjects.enum";

export class OrderExpirationTimeReachedPublisher extends BaseEventPublisher<IOrderExpirationTimeReached> {
    subject: Subjects.OrderExpirationTimeReached = Subjects.OrderExpirationTimeReached;
}