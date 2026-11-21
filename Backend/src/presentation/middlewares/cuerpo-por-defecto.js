// Express 5 deja req.body en undefined si la petición no trae cuerpo
export const cuerpoPorDefecto = (req, res, next) => {
  req.body ??= {};
  next();
};