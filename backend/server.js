const express = require('express');
require('dotenv').config({ path: '.env' });
const morgan = require('morgan');
const cors = require('cors');

require('./config/db'); 

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}/api`));