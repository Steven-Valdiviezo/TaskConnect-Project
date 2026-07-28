import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Propuesta } from '../../../models/propuesta.model';

@Component({
  selector: 'app-mis-propuestas',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './mis-propuestas.html',
  styleUrl: './mis-propuestas.css'
})
export class MisPropuestas implements OnInit {
  private propuestaSrv = inject(PropuestaService);
  private dialogo = inject(DialogoService);

  propuestas = signal<Propuesta[]>([]);
  cargando = signal(true);
  procesando = signal<number | null>(null);

  filtroEstado = signal<'todas' | 'pendiente' | 'aceptada' | 'rechazada'>('todas');

  propuestasFiltradas = computed(() =>
    this.filtroEstado() === 'todas'
      ? this.propuestas()
      : this.propuestas().filter(p => p.estado === this.filtroEstado())
  );
  
  conteoPendientes = computed(() => this.propuestas().filter(p => p.estado === 'pendiente').length);
  conteoAceptadas = computed(() => this.propuestas().filter(p => p.estado === 'aceptada').length);
  conteoRechazadas = computed(() => this.propuestas().filter(p => p.estado === 'rechazada').length);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.propuestaSrv.listarEnviadas().subscribe(r => {
      this.propuestas.set(r.propuestas);
      this.cargando.set(false);
    });
  }

  async retirar(p: Propuesta): Promise<void> {
    const ok = await this.dialogo.confirmar(`¿Retirar tu propuesta para "${p.titulo_proyecto}"?`, { titulo: 'Retirar propuesta', textoConfirmar: 'Sí, retirar' });
    if (!ok) return;

    this.procesando.set(p.id_propuesta);
    this.propuestaSrv.retirar(p.id_propuesta).subscribe({
      next: () => { this.cargar(); this.procesando.set(null); },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo retirar la propuesta.', 'Error');
        this.procesando.set(null);
      }
    });
  }

  filtrarPorEstado(estado: 'todas' | 'pendiente' | 'aceptada' | 'rechazada'): void {
    this.filtroEstado.set(estado);
  }

  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'pendiente': return { bg: '#E6F1FB', color: '#0C447C' };
      case 'aceptada': return { bg: '#EAF3DE', color: '#27500A' };
      default: return { bg: '#2a3040', color: '#6e8fa8' };
    }
  }
}