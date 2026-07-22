import { verificarToken } from '../utils/jwt.util.js';

export const autenticar = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = verificarToken(token);
        req.usuario = payload; // { id_usuario, rol, id_cliente?, id_freelancer? }
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
        }
        next();
    };
};