import jwt from 'jsonwebtoken';
import ApiError from '../errors/ApiError.js';
export const requireAdmin = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            next(ApiError.unauthorized('Missing authorization token'));
            return;
        }
        const token = header.slice(7);
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        next(ApiError.unauthorized('Invalid or expired token'));
    }
};
