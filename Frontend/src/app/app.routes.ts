import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Login } from './components/auth/login/login';
import { Registro } from './components/auth/registro/registro';
import { DashboardCliente } from './components/cliente/dashboard-cliente/dashboard-cliente';
import { PublicarProyecto } from './components/cliente/publicar-proyecto/publicar-proyecto';
import { DashboardFreelancer } from './components/freelancer/dashboard-freelancer/dashboard-freelancer';
import { DetalleProyecto } from './components/freelancer/detalle-proyecto/detalle-proyecto';
import { Mensajes } from './components/shared/mensajes/mensajes';
import { Pagos } from './components/shared/pagos/pagos';
import { Calificaciones } from './components/shared/calificaciones/calificaciones';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'cliente/dashboard', component: DashboardCliente },
  { path: 'cliente/publicar-proyecto', component: PublicarProyecto },
  { path: 'freelancer/dashboard', component: DashboardFreelancer },
  { path: 'freelancer/proyecto/:id', component: DetalleProyecto },
  { path: 'mensajes', component: Mensajes },
  { path: 'pagos', component: Pagos },
  { path: 'calificaciones', component: Calificaciones },
];
