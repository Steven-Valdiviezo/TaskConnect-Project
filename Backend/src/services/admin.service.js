import {
  listarUsuariosRepository,
  desactivarUsuarioRepository,
  reactivarUsuarioRepository,
  listarAuditoriaRepository,
  contarUsuariosDetalladoRepository, contarProyectosDetalladoRepository, proyectosPorCategoriaRepository,
  freelancersPorProfesionRepository, contarPropuestasRepository, contarContratosRepository, sumarPagosRepository
} from '../repositories/admin.repository.js';

export const listarUsuariosService = async (filtros) => {
  return await listarUsuariosRepository(filtros);
};

export const desactivarUsuarioService = async (adminActual, id_usuario) => {
  if (adminActual.id_usuario === id_usuario) {
    const error = new Error('No puedes desactivar tu propia cuenta de administrador');
    error.status = 400;
    throw error;
  }

  const usuario = await desactivarUsuarioRepository(id_usuario);

  if (!usuario) {
    const error = new Error('Usuario no encontrado o ya estaba inactivo');
    error.status = 404;
    throw error;
  }

  return usuario;
};

export const reactivarUsuarioService = async (id_usuario) => {
  const usuario = await reactivarUsuarioRepository(id_usuario);

  if (!usuario) {
    const error = new Error('Usuario no encontrado o ya estaba activo');
    error.status = 404;
    throw error;
  }

  return usuario;
};

export const listarAuditoriaService = async (filtros) => {
  return await listarAuditoriaRepository(filtros);
};

// Actualizado por lo nuevo de repostory 
export const obtenerEstadisticasAdminService = async () => {
  const [usuariosDetalle, proyectos, categorias, profesiones, propuestas, contratos, pagos] = await Promise.all([
    contarUsuariosDetalladoRepository(),
    contarProyectosDetalladoRepository(),
    proyectosPorCategoriaRepository(),
    freelancersPorProfesionRepository(),
    contarPropuestasRepository(),
    contarContratosRepository(),
    sumarPagosRepository()
  ]);

  const totalClientes = usuariosDetalle.filter(u => u.rol === 'cliente').reduce((a, u) => a + u.total, 0);
  const totalFreelancers = usuariosDetalle.filter(u => u.rol === 'freelancer').reduce((a, u) => a + u.total, 0);

  return {
    total_usuarios: totalClientes + totalFreelancers,
    total_clientes: totalClientes,
    total_freelancers: totalFreelancers,
    proyectos,
    proyectos_por_categoria: categorias,
    freelancers_por_profesion: profesiones,
    propuestas,
    contratos,
    monto_total_pagado: Number(pagos.total_pagado),
    comision_total: Number(pagos.total_comision)
  };
};