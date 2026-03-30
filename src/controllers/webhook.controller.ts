import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { OrderStatus, Prisma } from '@prisma/client';

import { orderWebhookSchema } from '../schemas/order.schema';
import { orderService } from '../services/order.service';
import { orderRepository } from '../repositories/order.repository';
import { orderLogRepository } from '../repositories/order-log.repository';
import { mapOrderToExternal } from '../integrations/payload.mapper';
import { sendOrderToExternal } from '../services/external.service';

export const receiveOrderWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = orderWebhookSchema.parse(req.body);

    const order = await orderService.createOrder(payload);

    await orderRepository.updateStatus(order.id, OrderStatus.PROCESSING);

    await orderLogRepository.create({
      orderId: order.id,
      eventType: 'ORDER_PROCESSING',
      message: 'Order moved to processing state',
      requestPayload: payload as Prisma.InputJsonValue,
    });

    const externalPayload = mapOrderToExternal({
      ...order,
      items: payload.items,
    });

    try {
      const externalResponse = await sendOrderToExternal(externalPayload);

      await orderRepository.updateStatus(order.id, OrderStatus.SENT);

      await orderLogRepository.create({
        orderId: order.id,
        eventType: 'ORDER_SENT',
        message: 'Order sent successfully to external system',
        requestPayload: externalPayload as Prisma.InputJsonValue,
        responsePayload: externalResponse as Prisma.InputJsonValue,
        statusCode: 200,
      });

      res.status(202).json({
        success: true,
        message: 'Webhook received and order processed successfully',
        data: {
          id: order.id,
          correlationId: order.correlationId,
          status: OrderStatus.SENT,
        },
      });
    } catch (externalError: any) {
      const statusCode = externalError?.response?.status ?? 500;
      const responseData = externalError?.response?.data ?? {
        message: externalError?.message || 'Unknown external error',
      };

      await orderRepository.updateStatus(
        order.id,
        OrderStatus.FAILED,
        responseData?.message || 'External integration failed'
      );

      await orderLogRepository.create({
        orderId: order.id,
        eventType: 'ORDER_FAILED',
        message: 'Error sending order to external system',
        requestPayload: externalPayload as Prisma.InputJsonValue,
        responsePayload: responseData as Prisma.InputJsonValue,
        statusCode,
      });

      res.status(202).json({
        success: false,
        message: 'Webhook received but external integration failed',
        data: {
          id: order.id,
          correlationId: order.correlationId,
          status: OrderStatus.FAILED,
        },
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues,
      });
      return;
    }

    next(error);
  }
};