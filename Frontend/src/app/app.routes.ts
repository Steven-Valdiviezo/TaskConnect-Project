import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { ComoFunciona } from './components/landing/como-funciona/como-funciona';
import { Categorias } from './components/landing/categorias/categorias';
import { Acerca } from './components/landing/acerca/acerca';
import { Login } from './components/auth/login/login';
import { Registro } from './components/auth/registro/registro';
import { ClienteShell } from './components/cliente/cliente-shell/cliente-shell';
import { DashboardCliente } from './components/cliente/dashboard-cliente/dashboard-cliente';
import { PublicarProyecto } from './components/cliente/publicar-proyecto/publicar-proyecto';
import { MisProyectos } from './components/cliente/mis-proyectos/mis-proyectos';
import { PropuestasCliente } from './components/cliente/propuestas-cliente/propuestas-cliente';
import { ContratosCliente } from './components/cliente/contratos-cliente/contratos-cliente';
import { FreelancerShell } from './components/freelancer/freelancer-shell/freelancer-shell';
import { DashboardFreelancer } from './components/freelancer/dashboard-freelancer/dashboard-freelancer';
import { DetalleProyecto } from './components/freelancer/detalle-proyecto/detalle-proyecto';
import { BuscarTrabajo } from './components/freelancer/buscar-trabajo/buscar-trabajo';
import { MisPropuestas } from './components/freelancer/mis-propuestas/mis-propuestas';
import { ContratosFreelancer } from './components/freelancer/contratos-freelancer/contratos-freelancer';
import { Mensajes } from './components/shared/mensajes/mensajes';
import { Pagos } from './components/shared/pagos/pagos';
import { Calificaciones } from './components/shared/calificaciones/calificaciones';
import { PerfilCliente } from './components/cliente/perfil-cliente/perfil-cliente';
import { PerfilFreelancer } from './components/freelancer/perfil-freelancer/perfil-freelancer';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'como-funciona', component: ComoFunciona },
  { path: 'categorias', component: Categorias },
  { path: 'acerca', component: Acerca },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  {
    path: 'cliente', component: ClienteShell, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardCliente },
      { path: 'publicar-proyecto', component: PublicarProyecto },
      { path: 'mis-proyectos', component: MisProyectos },
      { path: 'propuestas', component: PropuestasCliente },
      { path: 'contratos', component: ContratosCliente },
      { path: 'mensajes', component: Mensajes },
      { path: 'pagos', component: Pagos },
      { path: 'calificaciones', component: Calificaciones },
      { path: 'perfil', component: PerfilCliente }
    ]
  },
  {
    path: 'freelancer', component: FreelancerShell, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardFreelancer },
      { path: 'buscar-trabajo', component: BuscarTrabajo },
      { path: 'mis-propuestas', component: MisPropuestas },
      { path: 'contratos', component: ContratosFreelancer },
      { path: 'mensajes', component: Mensajes },
      { path: 'pagos', component: Pagos },
      { path: 'proyecto/:id', component: DetalleProyecto },
      { path: 'perfil', component: PerfilFreelancer }
    ]
  },
  {path: '**', redirectTo: '' }
];