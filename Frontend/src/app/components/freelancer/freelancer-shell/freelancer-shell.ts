import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { PagoService } from '../../../core/services/pago.service';

interface Notificacion { icono: string; color: string; texto: string; ruta: string; }

@Component({
  selector: 'app-freelancer-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './freelancer-shell.html'
})
export class FreelancerShell implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private propuestaSrv = inject(PropuestaService);
  private pagoSrv = inject(PagoService);

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
      propuestas: this.propuestaSrv.listarEnviadas(),
      pagos: this.pagoSrv.listarDeMisContratos()
    }).subscribe(({ propuestas, pagos }) => {
      const notifs: Notificacion[] = [];

      propuestas.propuestas.filter(p => p.estado === 'aceptada').forEach(p => notifs.push({
        icono: 'fa-circle-check', color: '#60b4e8',
        texto: `Tu propuesta para "${p.titulo_proyecto}" fue aceptada`,
        ruta: '/freelancer/mis-propuestas'
      }));

      pagos.filter(x => x.pago?.estado === 'pagado').forEach(x => notifs.push({
        icono: 'fa-sack-dollar', color: '#5DCAA5',
        texto: `Cobraste $${(Number(x.pago!.monto) - Number(x.pago!.comision)).toFixed(2)} en "${x.contrato.titulo_proyecto}"`,
        ruta: '/freelancer/pagos'
      }));

      pagos.filter(x => !x.pago && x.contrato.estado === 'activo').forEach(x => notifs.push({
        icono: 'fa-hourglass-half', color: '#EF9F27',
        texto: `Esperando que el cliente pague "${x.contrato.titulo_proyecto}"`,
        ruta: '/freelancer/contratos'
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