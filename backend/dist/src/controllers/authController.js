import jwt from 'jsonwebtoken';
import ApiError from '../errors/ApiError.js';
export const login = (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password || password !== process.env.ADMIN_PASSWORD) {
            next(ApiError.unauthorized('Invalid credentials'));
            return;
        }
        console.log('Admin login successful');
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error('JWT_SECRET not configured');
        const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '24h' });
        res.json({ token, expiresIn: 86400 });
    }
    catch (err) {
        next(err);
    }
};
