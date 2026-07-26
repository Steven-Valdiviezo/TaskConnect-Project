import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Propuesta } from '../../../models/propuesta.model';
import { DialogoService } from '../../../core/services/dialogo.service';

@Component({
  selector: 'app-propuestas-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './propuestas-cliente.html',
  styleUrl: './propuestas-cliente.css'
})
export class PropuestasCliente implements OnInit {
  private proyectoSrv = inject(ProyectoService);
  private propuestaSrv = inject(PropuestaService);
  private contratoSrv = inject(ContratoService);
  private dialogo = inject(DialogoService);

  proyectos = signal<Proyecto[]>([]);
  propuestas = signal<Propuesta[]>([]);
  cargandoPropuestas = signal(false);
  procesando = signal<number | null>(null);

  filtroProyecto = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.filtroProyecto.valueChanges.subscribe(id => {
      if (id) this.cargarPropuestas(id);
    });

    this.proyectoSrv.listarMios().subscribe(r => {
      this.proyectos.set(r.proyectos);
      const primero = r.proyectos.find(p => (p.total_propuestas ?? 0) > 0) ?? r.proyectos[0];
      if (primero) this.filtroProyecto.setValue(primero.id_proyecto);
    });
  }

  private cargarPropuestas(idProyecto: number): void {
    this.cargandoPropuestas.set(true);
    this.propuestaSrv.listarDeProyecto(idProyecto).subscribe(r => {
      this.propuestas.set(r.propuestas);
      this.cargandoPropuestas.set(false);
    });
  }

  async aceptar(p: Propuesta): Promise<void> {
    const ok = await this.dialogo.confirmar(
      `¿Aceptar la propuesta de ${p.nombre_freelancer}? Se generará un contrato y se rechazarán las demás.`,
      { titulo: 'Aceptar propuesta', textoConfirmar: 'Sí, aceptar' }
    );
    if (!ok) return;
  
    this.procesando.set(p.id_propuesta);
    this.contratoSrv.aceptarPropuesta(p.id_propuesta).subscribe({
      next: () => { this.cargarPropuestas(p.id_proyecto); this.procesando.set(null); },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo aceptar la propuesta.', 'Error');
        this.procesando.set(null);
      }
    });
  }

  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'pendiente': return { bg: '#E1F5EE', color: '#085041' };
      case 'aceptada': return { bg: '#EAF3DE', color: '#27500A' };
      default: return { bg: '#2a3a30', color: '#6e9e85' };
    }
  }
}