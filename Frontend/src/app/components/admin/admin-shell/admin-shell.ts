import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';

interface Notificacion { icono: string; color: string; texto: string; }

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css'
})
export class AdminShell implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private adminSrv = inject(AdminService);

  usuario = this.auth.usuario;
  iniciales = computed(() => {
    const nombre = this.usuario()?.nombre ?? '';
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  });

  notificaciones = signal<Notificacion[]>([]);
  mostrarNotificaciones = signal(false);

  ngOnInit(): void {
    this.adminSrv.listarUsuarios().subscribe(r => {
      const hace7dias = new Date();
      hace7dias.setDate(hace7dias.getDate() - 7);

      const nuevos = r.usuarios.filter(u => new Date(u.fecha_registro) >= hace7dias);
      this.notificaciones.set(nuevos.map(u => ({
        icono: 'fa-user-plus', color: '#9b96e0',
        texto: `Nuevo ${u.rol}: ${u.nombre}`
      })));
    });
  }

  irA(): void {
    this.mostrarNotificaciones.set(false);
    this.router.navigateByUrl('/admin/usuarios');
  }

  salir(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}