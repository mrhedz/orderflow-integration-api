import { OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export const metricsService = {
  async getSummary() {
    const [
      totalOrders,
      sent,
      failed,
      processing,
      retrying,
      received,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: OrderStatus.SENT },
      }),
      prisma.order.count({
        where: { status: OrderStatus.FAILED },
      }),
      prisma.order.count({
        where: { status: OrderStatus.PROCESSING },
      }),
      prisma.order.count({
        where: { status: OrderStatus.RETRYING },
      }),
      prisma.order.count({
        where: { status: OrderStatus.RECEIVED },
      }),
    ]);

    return {
      totalOrders,
      sent,
      failed,
      processing,
      retrying,
      received,
    };
  },
};