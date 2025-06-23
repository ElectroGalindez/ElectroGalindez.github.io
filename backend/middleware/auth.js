require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { authenticate } = require('./middleware/auth'); // Importar middleware

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Usar rutas
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', authenticate, cartRoutes); // Proteger rutas de carrito
app.use('/admin', authenticate, adminRoutes); // Proteger rutas de admin

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de ElectroGalíndez funcionando!');
});

// Ruta para verificar admins (solo para desarrollo)
app.get('/check-admin', async (req, res) => {
  try {
    const pool = require('./db');
    const result = await pool.query(
      "SELECT id, email, role FROM users WHERE role = 'admin'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error verificando admins:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});