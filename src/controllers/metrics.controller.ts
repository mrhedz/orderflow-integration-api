import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../services/metrics.service';

export const getMetricsSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await metricsService.getSummary();

    res.status(200).json({
      success: true,
      message: 'Metrics summary',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};