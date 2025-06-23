// Rutas en routes/adminRoutes.js
router.get('/orders', isAdmin, getOrders);
router.get('/users', isAdmin, getUsers);
router.patch('/products/:id/stock', isAdmin, updateStock);

// Ejemplo: Actualizar stock
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, id]);
  res.json({ message: 'Stock actualizado' });
};