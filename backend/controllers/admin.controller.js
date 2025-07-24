// controllers/admin.controller.js
const pool = require("../config/db");

exports.getAdminSummary = async (req, res) => {
  try {
    // 1. Obtener total de usuarios
    const usersRes = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(usersRes.rows[0].count);

    // 2. Obtener total de productos
    const productsRes = await pool.query("SELECT COUNT(*) FROM products");
    const totalProducts = parseInt(productsRes.rows[0].count);

    // 3. Obtener conteo de órdenes por estado (usando los valores correctos)
    const ordersRes = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'paid') AS paid,
        COUNT(*) FILTER (WHERE status = 'shipped') AS shipped,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
      FROM orders
    `);
    
    // 4. Calcular ingresos totales (solo órdenes pagadas o enviadas)
    const incomeRes = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS total 
      FROM orders 
      WHERE status IN ('paid', 'shipped')
    `);

    // 5. Obtener ventas semanales (solo órdenes pagadas o enviadas)
    const salesRes = await pool.query(`
      WITH date_series AS (
        SELECT generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') AS date
      )
      SELECT 
        TO_CHAR(ds.date, 'Dy') AS day,
        COALESCE(SUM(o.total), 0) AS sales
      FROM date_series ds
      LEFT JOIN orders o ON DATE(o.created_at) = ds.date 
        AND o.status IN ('paid', 'shipped')
      GROUP BY ds.date
      ORDER BY ds.date
    `);

    // 6. Preparar respuesta
    res.json({
      users: totalUsers,
      products: totalProducts,
      pendingOrders: parseInt(ordersRes.rows[0].pending || 0),
      paidOrders: parseInt(ordersRes.rows[0].paid || 0),
      shippedOrders: parseInt(ordersRes.rows[0].shipped || 0),
      cancelledOrders: parseInt(ordersRes.rows[0].cancelled || 0),
      totalIncome: parseFloat(incomeRes.rows[0].total || 0),
      weeklySales: salesRes.rows.map(row => ({
        day: row.day,
        sales: parseInt(row.sales)
      }))
    });

  } catch (err) {
    console.error("Error al obtener resumen:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: err.message
    });
  }
};