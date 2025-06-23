const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  const { orderId } = req.body;
  
  // 1. Verificar stock
  const items = await pool.query(
    'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
    [orderId]
  );

  for (const item of items.rows) {
    const product = await pool.query('SELECT stock FROM products WHERE id = $1', [item.product_id]);
    if (product.rows[0].stock < item.quantity) {
      return res.status(400).json({ error: `Stock insuficiente para producto ${item.product_id}` });
    }
  }

  // 2. Simular pago con Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10000, // $100.00 en centavos
    currency: 'usd',
  });

  // 3. Actualizar orden y stock
  await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', orderId]);
  
  for (const item of items.rows) {
    await pool.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [item.quantity, item.product_id]
    );
  }

  res.json({ clientSecret: paymentIntent.client_secret });
};