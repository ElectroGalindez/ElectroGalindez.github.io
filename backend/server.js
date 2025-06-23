require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/admin', require('./routes/adminRoutes'));  // Esta línea debe estar presente

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.get('/check-admin', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role FROM users WHERE role = 'admin'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error verificando admins:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

