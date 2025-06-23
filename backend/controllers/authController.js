const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

const register = async (req, res) => {
  // Validar datos aquí...
  const newUser = await User.create(req.body.email, req.body.password);
  res.status(201).json(newUser);
};

module.exports = { login, register };