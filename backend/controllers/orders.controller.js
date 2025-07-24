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

  // Validar que el estado sea uno de los permitidos
  const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Estado inválido',
      validStatuses
    });
  }

  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const check = await db.query('SELECT id FROM orders WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    await db.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    await db.query('DELETE FROM orders WHERE id = $1', [id]);

    res.json({ message: 'Orden eliminada correctamente', orderId: id });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id,
        o.user_id,
        o.total,
        o.status,
        o.created_at,
        u.email AS user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};