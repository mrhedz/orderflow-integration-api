import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check service health
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', getHealth);

export default router;