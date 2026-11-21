// Datos que viajan dentro del JWT (id_cliente o id_freelancer según el rol)
export const armarPayload = (usuario, idsPerfil) => ({
  id_usuario: usuario.id_usuario,
  nombre: usuario.nombre,
  rol: usuario.rol,
  ...(idsPerfil ?? {})
});