import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generarToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const verificarToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// 2FA Token generado y verificado con un tiempo de expiración más corto (5 minutos)
export const generarPreAuthToken = (payload) => {
    return jwt.sign({ ...payload, tipo: 'pre_auth' }, process.env.JWT_SECRET, {
        expiresIn: '5m'
    });
};

export const verificarPreAuthToken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.tipo !== 'pre_auth') {
        const error = new Error('Token de preautenticación inválido');
        error.status = 401;
        throw error;
    }
    return payload;
};