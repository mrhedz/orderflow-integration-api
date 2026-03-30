import { z } from 'zod';

export const orderItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  price: z.number().positive('Price must be greater than 0'),
});

export const orderWebhookSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.email('Customer email must be valid'),
  }),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  total: z.number().positive('Total must be greater than 0'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
});

export type OrderWebhookInput = z.infer<typeof orderWebhookSchema>;