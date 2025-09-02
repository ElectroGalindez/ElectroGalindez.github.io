// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ha ocurrido un error inesperado',
  });
};

module.exports = errorHandler;
