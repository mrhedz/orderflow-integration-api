import { Request, Response, NextFunction } from 'express';
import { OrderStatus, Prisma } from '@prisma/client';
import { orderRepository } from '../repositories/order.repository';
import { orderLogRepository } from '../repositories/order-log.repository';
import { mapOrderToExternal } from '../integrations/payload.mapper';
import { sendOrderToExternal } from '../services/external.service';

export const getOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderRepository.findMany();

    res.status(200).json({
      success: true,
      message: 'Orders list',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order found',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const logs = await orderLogRepository.findByOrderId(orderId);

    res.status(200).json({
      success: true,
      message: 'Order logs',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const retryOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    if (order.status !== OrderStatus.FAILED) {
      res.status(400).json({
        success: false,
        message: 'Retry is only allowed for orders in FAILED status',
      });
      return;
    }

    await orderRepository.incrementRetryCount(order.id);
    await orderRepository.updateStatus(order.id, OrderStatus.RETRYING);

    await orderLogRepository.create({
      orderId: order.id,
      eventType: 'ORDER_RETRY',
      message: 'Manual retry triggered',
      requestPayload: order.rawPayload
        ? (order.rawPayload as Prisma.InputJsonValue)
        : undefined,
    });

    const rawPayload = order.rawPayload as Prisma.JsonObject;
    const customer = rawPayload.customer as Prisma.JsonObject;
    const items = rawPayload.items as Prisma.JsonArray;

    const externalPayload = mapOrderToExternal({
      customerName: String(order.customerName),
      customerEmail: String(order.customerEmail),
      currency: String(order.currency),
      total: Number(order.total),
      correlationId: String(order.correlationId),
      items: items.map((item) => {
        const orderItem = item as Prisma.JsonObject;

        return {
          sku: String(orderItem.sku),
          name: String(orderItem.name),
          quantity: Number(orderItem.quantity),
          price: Number(orderItem.price),
        };
      }),
    });

    try {
      const externalResponse = await sendOrderToExternal(externalPayload);

      await orderRepository.updateStatus(order.id, OrderStatus.SENT);
      await orderRepository.updateExternalResponse(
        order.id,
        externalResponse as Prisma.InputJsonValue
      );

      await orderLogRepository.create({
        orderId: order.id,
        eventType: 'ORDER_SENT',
        message: 'Order sent successfully to external system after retry',
        requestPayload: externalPayload as Prisma.InputJsonValue,
        responsePayload: externalResponse as Prisma.InputJsonValue,
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Retry completed successfully',
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
        responseData?.message || 'External integration failed on retry'
      );

      await orderLogRepository.create({
        orderId: order.id,
        eventType: 'ORDER_FAILED',
        message: 'Retry failed while sending order to external system',
        requestPayload: externalPayload as Prisma.InputJsonValue,
        responsePayload: responseData as Prisma.InputJsonValue,
        statusCode,
      });

      res.status(200).json({
        success: false,
        message: 'Retry executed but external integration failed again',
        data: {
          id: order.id,
          correlationId: order.correlationId,
          status: OrderStatus.FAILED,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};