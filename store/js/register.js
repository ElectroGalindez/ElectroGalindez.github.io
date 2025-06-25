document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        billingAddress: document.getElementById('billingAddress').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        zipCode: document.getElementById('zipCode').value,
        telephone: document.getElementById('telephone').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        document.getElementById('registerMessage').innerText = result.message;
        
        if(response.ok) {
            // Redirigir a login o dashboard
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('..backend//db'); // Conexión a PostgreSQL

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, billingAddress, city, country, zipCode, telephone, password } = req.body;
        
        // 1. Validación de datos
        if(!firstName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 2. Verificar si el email existe
        const emailCheck = await db.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );
        
        if(emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // 3. Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Transacción para crear usuario y dirección
        await db.query('BEGIN');
        
        // Insertar usuario
        const userResult = await db.query(
            `INSERT INTO users 
            (first_name, last_name, email, password_hash, telephone, role) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING user_id`,
            [firstName, lastName, email, hashedPassword, telephone, 'customer']
        );
        
        const userId = userResult.rows[0].user_id;
        
        // Insertar dirección
        await db.query(
            `INSERT INTO addresses 
            (user_id, billing_address, city, country, zip_code) 
            VALUES ($1, $2, $3, $4, $5)`,
            [userId, billingAddress, city, country, zipCode]
        );
        
        await db.query('COMMIT');
        
        // 5. Generar token JWT
        const token = jwt.sign(
            { userId, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token
        });
        
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Buscar usuario
        const userResult = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if(userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = userResult.rows[0];
        
        // 2. Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // 3. Generar token con rol
        const token = jwt.sign(
            { 
                userId: user.user_id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // 4. Respuesta diferenciada
        const responseData = {
            token,
            user: {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        };
        
        res.json(responseData);
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Buscar usuario
        const userResult = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if(userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = userResult.rows[0];
        
        // 2. Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // 3. Generar token con rol
        const token = jwt.sign(
            { 
                userId: user.user_id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // 4. Respuesta diferenciada
        const responseData = {
            token,
            user: {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        };
        
        res.json(responseData);
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};