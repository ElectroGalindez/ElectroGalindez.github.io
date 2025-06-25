// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// REGISTRO DE USUARIO
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    // Resto de la lógica de registro...
    
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
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PERFIL DE USUARIO
const getProfile = async (req, res) => {
  // Lógica para obtener perfil...
};

// controllers/authController.js
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ... lógica de registro
    
    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      token: tokenJWT // Si estás generando token
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        // 1. Verificar si el usuario existe
        const userResult = await db.query(
            'SELECT user_id, first_name, email FROM users WHERE email = $1',
            [email]
        );
        
        if (userResult.rows.length === 0) {
            // Por seguridad, no revelamos si el email existe
            return res.json({ 
                message: 'Si el email está registrado, recibirás un enlace de recuperación' 
            });
        }
        
        const user = userResult.rows[0];
        
        // 2. Generar token único y seguro
        const resetToken = uuidv4();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        
        // 3. Hash del token antes de guardarlo
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // 4. Guardar en base de datos
        await db.query(
            `INSERT INTO password_reset_tokens 
            (user_id, token_hash, expires_at) 
            VALUES ($1, $2, $3)`,
            [user.user_id, tokenHash, expiresAt]
        );
        
        // 5. Enviar email con enlace
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user.user_id}`;
        
        // Aquí implementarías el envío real de email
        console.log(`Enlace de recuperación para ${user.email}: ${resetUrl}`);
        
        res.json({ 
            message: 'Se ha enviado un enlace de recuperación a tu email' 
        });
        
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.validateResetToken = async (req, res) => {
    const { token, userId } = req.query;
    
    try {
        // 1. Hash el token recibido
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        
        // 2. Buscar en base de datos
        const tokenResult = await db.query(
            `SELECT * FROM password_reset_tokens 
             WHERE token_hash = $1 
             AND user_id = $2 
             AND expires_at > NOW() 
             AND used = false`,
            [tokenHash, userId]
        );
        
        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ valid: false, error: 'Token inválido o expirado' });
        }
        
        res.json({ valid: true });
        
    } catch (error) {
        console.error('Error validando token:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, userId, newPassword } = req.body;
    
    try {
        // 1. Validar token (misma lógica que validateResetToken)
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        
        const tokenResult = await db.query(
            `SELECT * FROM password_reset_tokens 
             WHERE token_hash = $1 
             AND user_id = $2 
             AND expires_at > NOW() 
             AND used = false`,
            [tokenHash, userId]
        );
        
        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
        
        // 2. Hash nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // 3. Actualizar contraseña del usuario
        await db.query(
            'UPDATE users SET password_hash = $1 WHERE user_id = $2',
            [hashedPassword, userId]
        );
        
        // 4. Marcar token como usado
        await db.query(
            'UPDATE password_reset_tokens SET used = true WHERE token_hash = $1',
            [tokenHash]
        );
        
        res.json({ message: 'Contraseña actualizada exitosamente' });
        
    } catch (error) {
        console.error('Error restableciendo contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
function validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChars
    );
}

// En resetPassword
if (!validatePasswordStrength(newPassword)) {
    return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales'
    });
}
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
    const mailOptions = {
        from: `"ElectroGalindez" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Hola ${name},</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña en ElectroGalindez.</p>
                <p>Por favor haz clic en el siguiente enlace para continuar:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                              color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                       Restablecer Contraseña
                    </a>
                </p>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                <p><strong>Nota:</strong> Este enlace expirará en 15 minutos.</p>
                <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    Atentamente,<br>
                    El equipo de ElectroGalindez
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};
// Exporta como objeto con funciones
module.exports = {
  register,
  login,
  getProfile
};