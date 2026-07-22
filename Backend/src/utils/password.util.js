import bcrypt from 'bcryptjs';

export const hashPassword = async(plano) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plano, salt);
};

export const compararPassword = async(plano, hash) => {
    return await bcrypt.compare(plano, hash);
};