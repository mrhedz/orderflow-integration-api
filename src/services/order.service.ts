import { randomUUID } from 'crypto';
import { Prisma, OrderStatus } from '@prisma/client';
import { orderRepository } from '../repositories/order.repository';
import { orderLogRepository } from '../repositories/order-log.repository';
import { OrderWebhookInput } from '../schemas/order.schema';

export const orderService = {
  async createOrder(payload: OrderWebhookInput) {
    const correlationId = randomUUID();

    const order = await orderRepository.create({
      source: payload.source,
      correlationId,
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      status: OrderStatus.RECEIVED,
      currency: payload.currency.toUpperCase(),
      total: new Prisma.Decimal(payload.total),
      rawPayload: payload as Prisma.InputJsonValue,
    });

    await orderLogRepository.create({
      orderId: order.id,
      eventType: 'ORDER_RECEIVED',
      message: 'Order webhook received and stored successfully',
      requestPayload: payload as Prisma.InputJsonValue,
    });

    return order;
  },
};