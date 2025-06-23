const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');

class User {
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create({ email, password, role = 'customer' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, role, created_at`,
      [email, hashedPassword, role, true]
    );
    
    return result.rows[0];
  }

  static async updateLoginData(id) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  static async setResetToken(id, token, expiry) {
    await pool.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expiry = $2 
       WHERE id = $3`,
      [token, expiry, id]
    );
  }

  static async resetPassword(token, newPassword) {
    const user = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );
    
    if (!user.rows[0]) return null;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
       WHERE id = $2`,
      [hashedPassword, user.rows[0].id]
    );
    
    return user.rows[0];
  }

  static async comparePassword(inputPassword, storedHash) {
    return await bcrypt.compare(inputPassword, storedHash);
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = User;