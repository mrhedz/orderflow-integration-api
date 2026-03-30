export const mapOrderToExternal = (order: any) => {
  return {
    externalCustomerName: order.customerName,
    externalCustomerEmail: order.customerEmail,
    orderLines: order.items?.map((item: any) => ({
      productCode: item.sku,
      units: item.quantity,
      unitPrice: item.price,
    })) || [],
    orderTotal: order.total,
    currency: order.currency,
    correlationId: order.correlationId,
  };
};