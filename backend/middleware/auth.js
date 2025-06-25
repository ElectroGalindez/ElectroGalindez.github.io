const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  
  try {
    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el usuario existe en la base de datos
    const user = await User.findByEmail(decoded.email);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Usuario no encontrado o cuenta desactivada' });
    }
    
    // Añadir usuario al objeto request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    res.status(401).json({ error: 'Token inválido' });
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
  };
};
// middlewares/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if(!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

exports.isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
// En tu auth middleware
const verifyToken = (token) => {
  try {
    // Intenta con clave actual
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // Si falla, prueba con clave anterior
    if (process.env.OLD_JWT_SECRET) {
      return jwt.verify(token, process.env.OLD_JWT_SECRET);
    }
    throw e;
  }
};