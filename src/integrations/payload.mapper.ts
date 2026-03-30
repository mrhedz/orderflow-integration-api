type OrderItem = {
  sku: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderForExternalMapping = {
  customerName: string;
  customerEmail: string;
  currency: string;
  total: unknown;
  correlationId: string;
  items: OrderItem[];
};

export const mapOrderToExternal = (order: OrderForExternalMapping) => {
  return {
    externalCustomerName: order.customerName,
    externalCustomerEmail: order.customerEmail,
    orderLines: order.items.map((item) => ({
      productCode: item.sku,
      units: item.quantity,
      unitPrice: item.price,
    })),
    orderTotal: Number(order.total),
    currency: order.currency,
    correlationId: order.correlationId,
  };
};