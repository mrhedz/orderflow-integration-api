import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const orderLogRepository = {
  create(data: Prisma.OrderLogUncheckedCreateInput) {
    return prisma.orderLog.create({ data });
  },

  findByOrderId(orderId: string) {
    return prisma.orderLog.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  },
};