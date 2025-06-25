const express = require('express');
require('dotenv').config({ path: '.env' });
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en la dirección http://localhost:${PORT}`));