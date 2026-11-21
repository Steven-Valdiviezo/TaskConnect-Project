// Recibe el puerto TokenService, así el middleware no depende de jsonwebtoken
export const crearAutenticar = (tokenService) => (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    req.usuario = tokenService.verificar(token); // { id_usuario, rol, id_cliente?, id_freelancer? }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

export const permitirRoles = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
  }
  next();
};