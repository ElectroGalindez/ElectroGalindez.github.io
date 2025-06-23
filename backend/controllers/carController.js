const saveCart = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.id;

  // Crear orden temporal con estado 'cart'
  const orderResult = await pool.query(
    'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id',
    [userId, 'cart']
  );
  const orderId = orderResult.rows[0].id;

  // Guardar items
  for (const item of cartItems) {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
      [orderId, item.productId, item.quantity]
    );
  }

  res.status(201).json({ message: 'Carrito guardado' });
};