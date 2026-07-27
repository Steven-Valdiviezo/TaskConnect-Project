export interface EstadisticasPublicas {
  total_clientes: number;
  total_freelancers: number;
  total_usuarios: number;
  total_proyectos: number;
  total_proyectos_abiertos: number;
  total_proyectos_finalizados: number;
  total_categorias: number;
}

export interface EstadisticasAdmin {
  total_usuarios: number;
  total_clientes: number;
  total_freelancers: number;
  proyectos: { total: number; total_abiertos: number; total_ejecucion: number; total_finalizados: number; total_cancelados: number; };
  proyectos_por_categoria: { id_categoria: number; nombre_categoria: string; total: number }[];
  freelancers_por_profesion: { id_profesion: number; nombre: string; total: number }[];
  propuestas: { total: number; total_aceptadas: number };
  contratos: { total: number; total_activos: number; total_completados: number };
  monto_total_pagado: number;
  comision_total: number;
}