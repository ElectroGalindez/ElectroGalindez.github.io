const express = require('express');
require('dotenv').config({ path: '.env' });
const morgan = require('morgan');
const cors = require('cors');

require('./config/db'); // Importa la configuración de la base de datos

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en la dirección http://localhost:${PORT}`));