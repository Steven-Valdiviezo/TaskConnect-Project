// traduce los RAISE EXCEPTION de Postgres (código P0001) en respuestas HTTP legibles
// En vez de un 500 genérico
export const manejarErrores = (error, req, res, next) => {
    console.error(error);

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

    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
};