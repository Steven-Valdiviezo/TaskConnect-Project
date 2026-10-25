// traduce los RAISE EXCEPTION de Postgres (código P0001) en respuestas HTTP legibles
// En vez de un 500 genérico
export const manejarErrores = (error, req, res, next) => {
    console.error(error);

    // Errores con status propio (los lanzan los services con error.status): se respetan tal cual
    if (error.status) {
        return res.status(error.status).json({ mensaje: error.message });
    }

    // Formato inválido para el tipo (ej. "abc" donde va un número), texto demasiado largo o número fuera de rango
    if (['22P02', '22001', '22003'].includes(error.code)) {
        return res.status(400).json({ mensaje: 'Datos inválidos: revisa los formatos y las longitudes permitidas' });
    }

    // Errores lanzados por RAISE EXCEPTION en triggers/funciones
    if (error.code === 'P0001') {
        return res.status(400).json({ mensaje: error.message });
    }

    // Violación de restricción UNIQUE
    if (error.code === '23505') {
        return res.status(409).json({ mensaje: 'El registro ya existe (violación de unicidad)' });
    }

    // Violación de CHECK constraint
    if (error.code === '23514') {
        return res.status(400).json({ mensaje: 'Datos inválidos según las reglas de la base de datos' });
    }

    // Violación de FOREIGN KEY constraint
    if (error.code === '23503') {
        return res.status(409).json({ mensaje: 'No se puede eliminar: el registro está referenciado por otros datos' });
    }
    
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
};