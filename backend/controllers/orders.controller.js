const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

exports.createOrder = async (req, res) => {
  const { user_id, items } = req.body;

  try {
    await db.query('BEGIN');

    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    const orderResult = await db.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
      [user_id, total]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await db.query('COMMIT');
    res.status(201).json({ message: 'Order created', order_id: orderId });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Error creating order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [
      status,
      id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating status' });
  }
};
