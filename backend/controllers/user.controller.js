// controllers/user.controller.js
const pool = require('../config/db');

// Obtener todos los usuarios (solo datos básicos)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY id');
    res.status(200).json(result.rows);
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
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Rol actualizado exitosamente',
      user: result.rows[0],
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
