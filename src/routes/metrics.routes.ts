import { Router } from 'express';
import { getMetricsSummary } from '../controllers/metrics.controller';

const router = Router();

/**
 * @openapi
 * /api/metrics/summary:
 *   get:
 *     tags:
 *       - Metrics
 *     summary: Get metrics summary
 *     responses:
 *       200:
 *         description: Metrics summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Metrics summary
 *                 data:
 *                   $ref: '#/components/schemas/MetricsSummary'
 */
router.get('/summary', getMetricsSummary);

export default router;