const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { z } = require('zod');

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role_name },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );
    return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        console.log('Intento de login para:', email);

        const result = await db.query(
            'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('¿Password coincide?:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Guardar refresh token en la BD
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
        );

        res.json({
            user: { id: user.id, username: user.username, email: user.email, role: user.role_name },
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token requerido' });

    try {
        const result = await db.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
        if (result.rows.length === 0) return res.status(403).json({ message: 'Refresh token no válido' });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        const userResult = await db.query(
            'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
            [decoded.id]
        );
        const user = userResult.rows[0];

        const tokens = generateTokens(user);

        // Opcional: Rotar el refresh token (eliminar el viejo, insertar el nuevo)
        await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
        );

        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: 'Refresh token expirado o no válido' });
    }
};

exports.logout = async (req, res, next) => {
    const { token } = req.body;
    try {
        await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
