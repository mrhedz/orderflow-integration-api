const express = require('express');

const app = express();
app.use(express.json());

app.post('/external/orders', (req, res) => {
  console.log('External API received payload:', req.body);

  const shouldFail = req.body?.externalCustomerEmail === 'fail@example.com';

  if (shouldFail) {
    return res.status(500).json({
      success: false,
      message: 'Simulated external system error',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order processed successfully by external system',
    externalOrderId: `EXT-${Date.now()}`,
  });
});

app.listen(4000, () => {
  console.log('Mock external API running on http://localhost:4000');
});