import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  retryOrder,
  getOrderLogs,
} from '../controllers/orders.controller';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/', getOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get an order by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @openapi
 * /api/orders/{id}/logs:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get logs for an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order logs retrieved successfully
 */
router.get('/:id/logs', getOrderLogs);

/**
 * @openapi
 * /api/orders/{id}/retry:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Retry a failed order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       200:
 *         description: Retry executed
 *       400:
 *         description: Retry not allowed
 *       404:
 *         description: Order not found
 */
router.post('/:id/retry', retryOrder);

export default router;