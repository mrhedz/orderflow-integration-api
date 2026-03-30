import { Prisma, OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export const orderRepository = {
  create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({ data });
  },

  findMany() {
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
    });
  },

  updateStatus(id: string, status: OrderStatus, lastErrorMessage?: string | null) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        lastErrorMessage: lastErrorMessage ?? null,
      },
    });
  },

  incrementRetryCount(id: string) {
    return prisma.order.update({
      where: { id },
      data: {
        retryCount: {
          increment: 1,
        },
      },
    });
  },

  updateExternalResponse(id: string, externalResponse: Prisma.InputJsonValue) {
    return prisma.order.update({
      where: { id },
      data: {
        externalResponse,
      },
    });
  },
};