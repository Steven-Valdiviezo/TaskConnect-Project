import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { EstadisticasAdmin } from '../../../models/estadisticas.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit {
  private adminSrv = inject(AdminService);

  estadisticas = signal<EstadisticasAdmin | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    this.adminSrv.obtenerEstadisticas().subscribe(r => {
      this.estadisticas.set(r.estadisticas);
      this.cargando.set(false);
    });
  }

  porcentaje(total: number, parcial: number): number {
    return total > 0 ? Math.round((parcial / total) * 100) : 0;
  }

  colorBarra(i: number): string {
    const colores = ['#185FA5', '#0F6E56', '#854F0B', '#9b96e0', '#4a4580', '#60b4e8', '#5DCAA5'];
    return colores[i % colores.length];
  }
}