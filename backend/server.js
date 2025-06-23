require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.listen(process.env.PORT || 4000, () => {
  console.log(`Servidor backend corriendo en puerto ${process.env.PORT}`);
});