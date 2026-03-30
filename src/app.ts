import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import webhookRoutes from './routes/webhook.routes';
import ordersRoutes from './routes/orders.routes';
import metricsRoutes from './routes/metrics.routes';
import healthRoutes from './routes/health.routes';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { swaggerSpec } from './docs/swagger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/webhooks', webhookRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/health', healthRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;