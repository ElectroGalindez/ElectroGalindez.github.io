const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTRO DE USUARIO
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        email: email,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// LOGIN DE USUARIO
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Resto de la lógica de login...
    res.status(200).json({
      success: true,
      message: 'Usuario autenticado exitosamente',
      user: {
        email: email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PERFIL DE USUARIO
const getProfile = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      user: {
        email: email,
      },
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Exporta como objeto con funciones
module.exports = {
  register,
  login,
  getProfile,
};
