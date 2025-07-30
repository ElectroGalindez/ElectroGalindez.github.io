// controllers/user.controller.js
const User = require('../models/User');

// Obtener todos los usuarios (solo datos básicos)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id email role').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar el rol del usuario
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('_id email role');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Rol actualizado exitosamente',
      user: user,
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
};
