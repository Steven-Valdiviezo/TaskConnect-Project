import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { PagoService } from '../../../core/services/pago.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Propuesta } from '../../../models/propuesta.model';

@Component({
  selector: 'app-dashboard-freelancer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-freelancer.html',
  styleUrl: './dashboard-freelancer.css'
})
export class DashboardFreelancer implements OnInit {
  private proyectoSrv = inject(ProyectoService);
  private propuestaSrv = inject(PropuestaService);
  private contratoSrv = inject(ContratoService);
  private pagoSrv = inject(PagoService);

  propuestas = signal<Propuesta[]>([]);
  contratosActivos = signal(0);
  ingresosEsteMes = signal(0);
  recomendados = signal<Proyecto[]>([]);
  cargando = signal(true);

  propuestasAceptadas = computed(() => this.propuestas().filter(p => p.estado === 'aceptada').length);

  ngOnInit(): void {
    this.propuestaSrv.listarEnviadas().subscribe(r => {
      this.propuestas.set(r.propuestas);
      const idsPropuestos = new Set(r.propuestas.map(p => p.id_proyecto));

      this.proyectoSrv.listarPublicos().subscribe(rp => {
        this.recomendados.set(rp.proyectos.filter(p => p.estado === 'abierto' && !idsPropuestos.has(p.id_proyecto)).slice(0, 3));
        this.cargando.set(false);
      });
    });

    this.contratoSrv.listarMios().subscribe(r => {
      this.contratosActivos.set(r.contratos.filter(c => c.estado === 'activo').length);
    });

    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      const ahora = new Date();
      const total = lista
        .filter(x => x.pago?.estado === 'pagado' && x.pago.fecha_pago &&
          new Date(x.pago.fecha_pago).getMonth() === ahora.getMonth() &&
          new Date(x.pago.fecha_pago).getFullYear() === ahora.getFullYear())
        .reduce((acc, x) => acc + (Number(x.pago!.monto) - Number(x.pago!.comision) / 2), 0);
      this.ingresosEsteMes.set(total);
    });
  }

  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'abierto': return { bg: '#E1F5EE', color: '#085041' };
      case 'ejecucion': return { bg: '#FAEEDA', color: '#633806' };
      default: return { bg: '#2a3040', color: '#6e8fa8' };
    }
  }
}