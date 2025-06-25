require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Configuración de conexión
const pool = new Pool({
  user: process.env.DB_USER || 'electrogalindez',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ElectroGalindez',
  password: process.env.DB_PASSWORD || '3l3ctrogalind3z*',
  port: process.env.DB_PORT || 5432,
});

// Middleware para verificar usuario existente
const checkExistingUser = async (req, res, next) => {
  const { email } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT email FROM users WHERE email = $1', 
      [email]
    );
    
    if (result.rows.length > 0) {
      return res.status(409).json({ 
        error: 'El correo electrónico ya está registrado',
        field: 'email'
      });
    }
    next();
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Endpoint de registro mejorado
app.post('/api/register', checkExistingUser, async (req, res) => {
  const {
    'first-name': firstName,
    'last-name': lastName,
    email,
    address,
    city,
    country,
    'zip-code': zipCode,
    tel: phone,
    password
  } = req.body;

  // Validación mejorada
  const errors = {};
  if (!firstName) errors.firstName = 'Nombre es requerido';
  if (!lastName) errors.lastName = 'Apellido es requerido';
  if (!email) errors.email = 'Email es requerido';
  if (!password) errors.password = 'Contraseña es requerida';
  // Añade validaciones para otros campos según necesites

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (
        first_name, last_name, email, password_hash,
        address, city, country, zip_code, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, first_name, last_name, email`,
      [
        firstName, lastName, email, hashedPassword,
        address, city, country, zipCode, phone
      ]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
      message: 'Registro exitoso. Redirigiendo...'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejo específico de error de email duplicado
    if (error.code === '23505' && error.constraint === 'unique_email') {
      return res.status(409).json({ 
        error: 'El correo electrónico ya está registrado',
        field: 'email'
      });
    }
    
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
const jwt = require('jsonwebtoken');

// Verificar que el secreto existe
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR FATAL: JWT_SECRET no definido');
  process.exit(1);
}

// Configuración avanzada de tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      role: user.role,
      iss: 'ElectroGalindez API',
      aud: 'electrogalindez@gmail.com'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      algorithm: 'HS512' // Algoritmo más fuerte
    }
  );
};

const fs = require('fs');
const crypto = require('crypto');

function auditSecrets() {
  const currentHash = crypto.createHash('sha256')
    .update(process.env.JWT_SECRET)
    .digest('hex');
  
  const auditLog = {
    date: new Date(),
    hash: currentHash,
    environment: process.env.NODE_ENV
  };
  
  // Guardar en archivo fuera del repositorio
  fs.appendFileSync('/secure/audit.log', JSON.stringify(auditLog) + '\n');
  
  console.log('✅ Auditoría de secretos completada');
}

// Ejecutar diariamente
setInterval(auditSecrets, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));