import { Routes } from '@angular/router';
// importa componetnes del apartado de la pagina principal y del apartado de autenticación/login
import { Landing } from './components/landing/landing';
import { ComoFunciona } from './components/landing/como-funciona/como-funciona';
import { Categorias } from './components/landing/categorias/categorias';
import { Acerca } from './components/landing/acerca/acerca';
import { Login } from './components/auth/login/login';
import { Registro } from './components/auth/registro/registro';
import { VerificarCorreo } from './components/auth/verificar-correo/verificar-correo';
// importa componentes del apartado cliente
import { ClienteShell } from './components/cliente/cliente-shell/cliente-shell';
import { DashboardCliente } from './components/cliente/dashboard-cliente/dashboard-cliente';
import { PublicarProyecto } from './components/cliente/publicar-proyecto/publicar-proyecto';
import { MisProyectos } from './components/cliente/mis-proyectos/mis-proyectos';
import { PropuestasCliente } from './components/cliente/propuestas-cliente/propuestas-cliente';
import { ContratosCliente } from './components/cliente/contratos-cliente/contratos-cliente';
import { MensajesCliente } from './components/cliente/mensajes-cliente/mensajes-cliente';
import { PagosCliente } from './components/cliente/pagos-cliente/pagos-cliente';
import { Calificaciones } from './components/shared/calificaciones/calificaciones';
import { PerfilCliente } from './components/cliente/perfil-cliente/perfil-cliente';
// importa componentes del apartado freelancer
import { FreelancerShell } from './components/freelancer/freelancer-shell/freelancer-shell';
import { DashboardFreelancer } from './components/freelancer/dashboard-freelancer/dashboard-freelancer';
import { BuscarTrabajo } from './components/freelancer/buscar-trabajo/buscar-trabajo';
import { MisPropuestas } from './components/freelancer/mis-propuestas/mis-propuestas';
import { ContratosFreelancer } from './components/freelancer/contratos-freelancer/contratos-freelancer';
import { DetalleProyecto } from './components/freelancer/detalle-proyecto/detalle-proyecto';
import { MensajesFreelancer } from './components/freelancer/mensajes-freelancer/mensajes-freelancer';
import { PagosFreelancer } from './components/freelancer/pagos-freelancer/pagos-freelancer';
import { PerfilFreelancer } from './components/freelancer/perfil-freelancer/perfil-freelancer';
// importa componentes del apartado Admin
import { AdminShell } from './components/admin/admin-shell/admin-shell';
import { DashboardAdmin } from './components/admin/dashboard-admin/dashboard-admin';
import { UsuariosAdmin } from './components/admin/usuarios-admin/usuarios-admin';
import { ProyectosAdmin } from './components/admin/proyectos-admin/proyectos-admin';
import { CategoriasAdmin } from './components/admin/categorias-admin/categorias-admin';
import { ProfesionesAdmin } from './components/admin/profesiones-admin/profesiones-admin';
// importa guardias para proteger rutas
import { rolGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'como-funciona', component: ComoFunciona },
  { path: 'categorias', component: Categorias },
  { path: 'acerca', component: Acerca },
  { path: 'login', component: Login },
  { path: 'login/verificar-correo', component: VerificarCorreo },
  { path: 'registro', component: Registro },
  {
    path: 'cliente', component: ClienteShell, canActivate: [rolGuard(['cliente'])], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardCliente },
      { path: 'mis-proyectos', component: MisProyectos },
      { path: 'publicar-proyecto', component: PublicarProyecto },
      { path: 'propuestas', component: PropuestasCliente },
      { path: 'contratos', component: ContratosCliente },
      { path: 'mensajes', component: MensajesCliente },
      { path: 'pagos', component: PagosCliente },
      { path: 'calificaciones', component: Calificaciones },
      { path: 'perfil', component: PerfilCliente }
    ]
  },
  {
    path: 'freelancer', component: FreelancerShell, canActivate: [rolGuard(['freelancer'])], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardFreelancer },
      { path: 'buscar-trabajo', component: BuscarTrabajo },
      { path: 'mis-propuestas', component: MisPropuestas },
      { path: 'contratos', component: ContratosFreelancer },
      { path: 'mensajes', component: MensajesFreelancer },
      { path: 'pagos', component: PagosFreelancer },
      { path: 'proyecto/:id', component: DetalleProyecto },
      { path: 'perfil', component: PerfilFreelancer }
    ]
  },
  {
    path: 'admin', component: AdminShell, canActivate: [rolGuard(['administrador'])], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdmin },
      { path: 'usuarios', component: UsuariosAdmin },
      { path: 'proyectos', component: ProyectosAdmin },
      { path: 'categorias', component: CategoriasAdmin },
      { path: 'profesiones', component: ProfesionesAdmin }
    ]
  },
  { path: '**', redirectTo: '' }
];