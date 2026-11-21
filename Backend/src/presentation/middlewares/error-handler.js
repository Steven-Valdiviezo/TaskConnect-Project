// Traduce los errores de la aplicación y de PostgreSQL en respuestas HTTP legibles
export const manejarErrores = (error, req, res, next) => {
  // Errores con status propio (ErrorValidacion, NoEncontrado, Prohibido, Conflicto...): se respetan tal cual
  if (error.status) {
    if (error.status >= 500) console.error(error);
    return res.status(error.status).json({ mensaje: error.message });
  }

  // Con TypeORM el código de PostgreSQL llega en error.code o dentro de error.driverError
  const codigo = error.code ?? error.driverError?.code;
  const mensajeBD = error.driverError?.message ?? error.message;

  // Formato inválido para el tipo (ej. "abc" donde va un número), texto demasiado largo o número fuera de rango
  if (['22P02', '22001', '22003'].includes(codigo)) {
    return res.status(400).json({ mensaje: 'Datos inválidos: revisa los formatos y las longitudes permitidas' });
  }

  // Errores lanzados por RAISE EXCEPTION en los triggers y funciones
  if (codigo === 'P0001') {
    return res.status(400).json({ mensaje: mensajeBD });
  }

  // Columna obligatoria sin valor (NOT NULL)
  if (codigo === '23502') {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  // Violación de UNIQUE
  if (codigo === '23505') {
    return res.status(409).json({ mensaje: 'El registro ya existe (violación de unicidad)' });
  }

  // Violación de CHECK
  if (codigo === '23514') {
    return res.status(400).json({ mensaje: 'Datos inválidos según las reglas de la base de datos' });
  }

  // Violación de FOREIGN KEY
  if (codigo === '23503') {
    return res.status(409).json({ mensaje: 'No se puede eliminar: el registro está referenciado por otros datos' });
  }

  console.error(error);
  const respuesta = { mensaje: 'Error interno del servidor' };
  if (process.env.NODE_ENV !== 'production') respuesta.error = error.message;
  return res.status(500).json(respuesta);
};