// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Configuración básica
const PORT = process.env.PORT || 4000;

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// Ruta de prueba obligatoria
app.get('/', (req, res) => {
  res.send('¡Backend de ElectroGalíndez funcionando correctamente!');
});

// Ruta de registro de prueba
app.post('/api/auth/register', (req, res) => {
  console.log('✅ Petición de registro recibida:', req.body);
  res.json({ 
    status: 'success',
    message: 'Registro simulado exitoso',
    data: {
      email: req.body.email,
      id: Math.floor(Math.random() * 1000)
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Función para obtener IP local
function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const name in interfaces) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// Iniciar servidor con verificación
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅✅✅ Servidor backend ACTIVO en puerto ${PORT} ✅✅✅`);
    console.log(`🔗 Acceso local: http://localhost:${PORT}`);
    console.log(`🌐 Acceso desde red: http://${getIPAddress()}:${PORT}`);
    console.log('\nEndpoints disponibles:');
    console.log(`- GET  /             → Verificar estado del servidor`);
    console.log(`- POST /api/auth/register → Registrar usuario (prueba)`);
  });
} catch (error) {
  console.error('❌❌❌ Error crítico al iniciar servidor:', error);
  process.exit(1);
}
