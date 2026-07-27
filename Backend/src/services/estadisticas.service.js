import {
    contarUsuariosPorRolRepository,
    contarProyectosRepository,
    contarCategoriasRepository
} from '../repositories/estadisticas.repository.js';

export const obtenerEstadisticasPublicasService = async () => {
    const [usuariosPorRol, proyectos, totalCategorias] = await Promise.all([
        contarUsuariosPorRolRepository(),
        contarProyectosRepository(),
        contarCategoriasRepository()
    ]);

    const totalClientes = usuariosPorRol.find(u => u.rol === 'cliente')?.total ?? 0;
    const totalFreelancers = usuariosPorRol.find(u => u.rol === 'freelancer')?.total ?? 0;

    return {
        total_clientes: totalClientes,
        total_freelancers: totalFreelancers,
        total_usuarios: totalClientes + totalFreelancers,
        total_proyectos: proyectos.total,
        total_proyectos_abiertos: proyectos.total_abiertos,
        total_proyectos_finalizados: proyectos.total_finalizados,
        total_categorias: totalCategorias
    };
};