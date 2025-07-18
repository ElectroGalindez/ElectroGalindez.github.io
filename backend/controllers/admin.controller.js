// controllers/admin.controller.js
const pool = require("../config/db");

exports.getAdminSummary = async (req, res) => {
  try {
    // Total de usuarios
    const usersRes = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(usersRes.rows[0].count);

    // Total de productos
    const productsRes = await pool.query("SELECT COUNT(*) FROM products");
    const totalProducts = parseInt(productsRes.rows[0].count);

    // Órdenes completadas y pendientes
    const ordersRes = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pendiente') AS pending,
        COUNT(*) FILTER (WHERE status = 'completada') AS completed
      FROM orders
    `);
    const pendingOrders = parseInt(ordersRes.rows[0].pending);
    const completedOrders = parseInt(ordersRes.rows[0].completed);

    // Ingresos totales
    const incomeRes = await pool.query(`
      SELECT SUM(oi.quantity * p.price) AS total
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
    `);
    const totalIncome = parseFloat(incomeRes.rows[0].total || 0);

    // Ventas semanales
    const salesRes = await pool.query(`
      SELECT 
        TO_CHAR(o.created_at, 'Dy') AS day,
        SUM(oi.quantity) AS sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY day
      ORDER BY MIN(o.created_at)
    `);

    const weeklySales = salesRes.rows.map(row => ({
      day: row.day,
      sales: parseInt(row.sales),
    }));

    res.json({
      users: totalUsers,
      products: totalProducts,
      pendingOrders,
      completedOrders,
      totalIncome,
      weeklySales,
    });

  } catch (err) {
    console.error("Error al obtener resumen:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
