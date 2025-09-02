// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// 1. Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// 2. Rutas de API (ANTES que cualquier *)
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/orders', require('./routes/orders.routes'));

app.get('/api/server/status', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

module.exports = app;