// Evita repetir el mismo throw en cada método de cada puerto
export const noImplementado = (puerto, metodo) => {
  throw new Error(`${puerto}.${metodo} debe ser implementado`);
};