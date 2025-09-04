// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Frontend
  credentials: true
}));

// ✅ Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Servir archivos estáticos (IMAGES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Rutas de API
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/orders', require('./routes/orders.routes'));

// ✅ Ruta de salud del servidor
app.get('/api/server/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando' 
  });
});

module.exports = app;