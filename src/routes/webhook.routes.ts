import { Router } from 'express';
import { receiveOrderWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * @openapi
 * /api/webhooks/orders:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Receive and process an order webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderWebhookInput'
 *     responses:
 *       202:
 *         description: Webhook processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/OrderSummaryResponse'
 *       400:
 *         description: Validation error
 */
router.post('/orders', receiveOrderWebhook);

export default router;