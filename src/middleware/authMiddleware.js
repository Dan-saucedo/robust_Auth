import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.header('app-token'); 
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado: falta el token ❌" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = verified;
        next();
    } catch (err) {
        // Si el token es inválido o expiró, devuelve 401
        return res.status(401).json({ message: "Token no válido o expirado" });
    }
};