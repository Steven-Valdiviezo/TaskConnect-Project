import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Propuesta } from '../../../models/propuesta.model';
import { DialogoService } from '../../../core/services/dialogo.service';
// Importes para el perfil publico de freelancer
import { UsuarioService } from '../../../core/services/usuario.service';
import { CalificacionService } from '../../../core/services/calificacion.service';
import { PerfilPublicoFreelancer } from '../../../models/usuario.model';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-propuestas-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './propuestas-cliente.html',
  styleUrl: './propuestas-cliente.css'
})
export class PropuestasCliente implements OnInit {
  private proyectoSrv = inject(ProyectoService);
  private propuestaSrv = inject(PropuestaService);
  private contratoSrv = inject(ContratoService);
  private dialogo = inject(DialogoService);

  //Perfil publico
  private usuarioSrv = inject(UsuarioService);
  private calificacionSrv = inject(CalificacionService);

  proyectos = signal<Proyecto[]>([]);
  propuestas = signal<Propuesta[]>([]);
  cargandoPropuestas = signal(false);
  procesando = signal<number | null>(null);

  /** Estado del panel de "ver perfil" del freelancer */
  perfilAbierto = signal(false);
  cargandoPerfil = signal(false);
  perfilSeleccionado = signal<PerfilPublicoFreelancer | null>(null);
  ratingSeleccionado = signal(0);

  /** true = viendo todas las propuestas de todos los proyectos; false = filtrado por un proyecto */
  verTodas = signal(false);
  
  /** Filtro de estado, aplicado sobre lo que ya está cargado (todas o por proyecto) */
  filtroEstado = signal<'todas' | 'pendiente' | 'aceptada' | 'rechazada'>('todas');
  
  propuestasFiltradas = computed(() =>
    this.filtroEstado() === 'todas'
      ? this.propuestas()
      : this.propuestas().filter(p => p.estado === this.filtroEstado())
  );
  
  conteoPendientes = computed(() => this.propuestas().filter(p => p.estado === 'pendiente').length);
  conteoAceptadas = computed(() => this.propuestas().filter(p => p.estado === 'aceptada').length);
  conteoRechazadas = computed(() => this.propuestas().filter(p => p.estado === 'rechazada').length);

  filtroProyecto = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.filtroProyecto.valueChanges.subscribe(id => {
      if (id) {
        this.verTodas.set(false);
        this.cargarPropuestas(id);
      }
    });
  
    this.proyectoSrv.listarMios().subscribe(r => {
      this.proyectos.set(r.proyectos);
      const primero = r.proyectos.find(p => (p.total_propuestas ?? 0) > 0) ?? r.proyectos[0];
      if (primero) this.filtroProyecto.setValue(primero.id_proyecto);
    });
  }

  verTodasLasPropuestas(): void {
    if (this.verTodas()) return;
  
    this.filtroEstado.set('todas');   // nuevo
    this.verTodas.set(true);
    this.filtroProyecto.setValue(null, { emitEvent: false });
    this.cargandoPropuestas.set(true);
    this.propuestaSrv.listarRecibidas().subscribe(r => {
      this.propuestas.set(r.propuestas);
      this.cargandoPropuestas.set(false);
    });
  }

  // Filtros agregados
  filtrarPorEstado(estado: 'todas' | 'pendiente' | 'aceptada' | 'rechazada'): void {
  this.filtroEstado.set(estado);
  }

  private cargarPropuestas(idProyecto: number): void {
    this.filtroEstado.set('todas');   // nuevo
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
      next: () => {
        if (this.verTodas()) this.verTodasLasPropuestas();
        else this.cargarPropuestas(p.id_proyecto);
        this.procesando.set(null);
      },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo aceptar la propuesta.', 'Error');
        this.procesando.set(null);
      }
    });
  }
  // Rechazar propuesta
  async rechazar(p: Propuesta): Promise<void> {
    const ok = await this.dialogo.confirmar(
      `¿Rechazar la propuesta de ${p.nombre_freelancer}?`,
      { titulo: 'Rechazar propuesta', textoConfirmar: 'Sí, rechazar' }
    );
    if (!ok) return;
  
    this.procesando.set(p.id_propuesta);
    this.propuestaSrv.rechazar(p.id_propuesta).subscribe({
      next: () => {
        if (this.verTodas()) this.verTodasLasPropuestas();
        else this.cargarPropuestas(p.id_proyecto);
        this.procesando.set(null);
      },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo rechazar la propuesta.', 'Error');
        this.procesando.set(null);
      }
    });
  }
  // Perfil publico de freelancer mostrado
  verPerfil(idFreelancer: number): void {
    this.perfilAbierto.set(true);
    this.cargandoPerfil.set(true);
    this.perfilSeleccionado.set(null);
  
    this.usuarioSrv.obtenerPerfilPublico(idFreelancer).subscribe({
      next: (r) => {
        this.perfilSeleccionado.set(r.perfil);
        this.cargandoPerfil.set(false);
      },
      error: () => this.cargandoPerfil.set(false)
    });
  
    this.calificacionSrv.reputacionDe(idFreelancer).subscribe({
      next: (r) => this.ratingSeleccionado.set(Number(r.reputacion) || 0),
      error: () => this.ratingSeleccionado.set(0)
    });
  }
  
  cerrarPerfil(): void {
    this.perfilAbierto.set(false);
    this.perfilSeleccionado.set(null);
    this.ratingSeleccionado.set(0);
  }

  // Clase de badge para el estado de la propuesta
  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'pendiente': return { bg: '#E1F5EE', color: '#085041' };
      case 'aceptada': return { bg: '#EAF3DE', color: '#27500A' };
      default: return { bg: '#2a3a30', color: '#6e9e85' };
    }
  }

}