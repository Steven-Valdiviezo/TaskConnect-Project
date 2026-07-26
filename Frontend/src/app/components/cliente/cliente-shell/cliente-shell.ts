import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PagoService } from '../../../core/services/pago.service';
import { CalificacionService } from '../../../core/services/calificacion.service';

interface Notificacion {
  icono: string;
  color: string;
  texto: string;
  ruta: string;
}

@Component({
  selector: 'app-cliente-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './cliente-shell.html'
})
export class ClienteShell implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private proyectoSrv = inject(ProyectoService);
  private pagoSrv = inject(PagoService);
  private calificacionSrv = inject(CalificacionService);

  usuario = this.auth.usuario;
  iniciales = computed(() => {
    const nombre = this.usuario()?.nombre ?? '';
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  });

  notificaciones = signal<Notificacion[]>([]);
  mostrarNotificaciones = signal(false);

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  private cargarNotificaciones(): void {
    forkJoin({
      proyectos: this.proyectoSrv.listarMios(),
      pagos: this.pagoSrv.listarDeMisContratos(),
      emitidas: this.calificacionSrv.misEmitidas()
    }).subscribe(({ proyectos, pagos, emitidas }) => {
      const notifs: Notificacion[] = [];

      proyectos.proyectos
        .filter(p => p.estado === 'abierto' && (p.total_propuestas ?? 0) > 0)
        .forEach(p => notifs.push({
          icono: 'fa-users', color: '#5DCAA5',
          texto: `${p.total_propuestas} propuesta(s) en "${p.titulo}"`,
          ruta: '/cliente/propuestas'
        }));

      pagos.filter(x => x.pago?.estado === 'pendiente').forEach(x => notifs.push({
        icono: 'fa-credit-card', color: '#EF9F27',
        texto: `Pago pendiente de confirmar · ${x.contrato.titulo_proyecto}`,
        ruta: '/cliente/pagos'
      }));

      pagos.filter(x => !x.pago && x.contrato.estado === 'activo').forEach(x => notifs.push({
        icono: 'fa-file-invoice-dollar', color: '#5DCAA5',
        texto: `Registra el pago del contrato "${x.contrato.titulo_proyecto}"`,
        ruta: '/cliente/contratos'
      }));

      const idsCalificados = new Set(emitidas.calificaciones.map(c => c.id_contrato));
      pagos.filter(x => x.contrato.estado === 'completado' && !idsCalificados.has(x.contrato.id_contrato))
        .forEach(x => notifs.push({
          icono: 'fa-star', color: '#EF9F27',
          texto: `Califica a ${x.contrato.nombre_contraparte}`,
          ruta: '/cliente/calificaciones'
        }));

      this.notificaciones.set(notifs);
    });
  }

  irA(ruta: string): void {
    this.mostrarNotificaciones.set(false);
    this.router.navigateByUrl(ruta);
  }

  salir(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}