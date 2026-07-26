import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { Proyecto } from '../../../models/proyecto.model';

@Component({
  selector: 'app-mis-proyectos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-proyectos.html'
})
export class MisProyectos implements OnInit {
  private proyectoSrv = inject(ProyectoService);

  proyectos = signal<Proyecto[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.proyectoSrv.listarMios().subscribe(r => {
      this.proyectos.set(r.proyectos);
      this.cargando.set(false);
    });
  }

  cancelar(p: Proyecto): void {
    if (!confirm(`¿Cancelar el proyecto "${p.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.proyectoSrv.cancelar(p.id_proyecto).subscribe({
      next: () => this.cargar(),
      error: (err: any) => alert(err?.error?.mensaje ?? 'No se pudo cancelar el proyecto.')
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