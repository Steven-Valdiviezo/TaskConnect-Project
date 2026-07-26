import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PagoService } from '../../../core/services/pago.service';
import { Proyecto } from '../../../models/proyecto.model';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-cliente.html',
  styleUrl: './dashboard-cliente.css'
})
export class DashboardCliente implements OnInit {
  private proyectoSrv = inject(ProyectoService);
  private pagoSrv = inject(PagoService);

  proyectos = signal<Proyecto[]>([]);
  totalPagado = signal(0);
  cargando = signal(true);

  proyectosActivos = computed(() => this.proyectos().filter(p => p.estado === 'abierto' || p.estado === 'ejecucion').length);
  propuestasRecibidas = computed(() => this.proyectos().reduce((acc, p) => acc + (p.total_propuestas ?? 0), 0));
  proyectosRecientes = computed(() => this.proyectos().slice(0, 3));

  ngOnInit(): void {
    this.proyectoSrv.listarMios().subscribe(r => {
      this.proyectos.set(r.proyectos);
      this.cargando.set(false);
    });

    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      const total = lista.reduce((acc, item) => acc + (item.pago?.estado === 'pagado' ? Number(item.pago.monto) : 0), 0);
      this.totalPagado.set(total);
    });
  }

  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'abierto': return { bg: '#E1F5EE', color: '#085041' };
      case 'ejecucion': return { bg: '#FAEEDA', color: '#633806' };
      case 'finalizado': return { bg: '#2a3a30', color: '#6e9e85' };
      default: return { bg: '#3a2a2a', color: '#e0a8a8' };
    }
  }
}