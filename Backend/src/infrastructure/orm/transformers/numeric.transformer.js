// PostgreSQL devuelve NUMERIC como texto; aquí lo pasamos a número al leer
export const numericTransformer = {
  to: (valor) => valor,
  from: (valor) => (valor === null || valor === undefined ? null : parseFloat(valor))
};