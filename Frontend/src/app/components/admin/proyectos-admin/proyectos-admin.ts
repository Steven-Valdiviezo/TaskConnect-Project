import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Proyecto } from '../../../models/proyecto.model';

@Component({
  selector: 'app-proyectos-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proyectos-admin.html',
  styleUrl: './proyectos-admin.css'
})
export class ProyectosAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private proyectoSrv = inject(ProyectoService);
  private dialogo = inject(DialogoService);

  proyectos = signal<Proyecto[]>([]);
  cargando = signal(true);
  procesando = signal<number | null>(null);

  textoFiltro = signal('');
  estadoFiltro = signal('');

  form = this.fb.group({ texto: [''], estado: [''] });

  proyectosFiltrados = computed(() => {
    const texto = this.textoFiltro();
    const estado = this.estadoFiltro();
    return this.proyectos().filter(p =>
      (!estado || p.estado === estado) &&
      (!texto || p.titulo.toLowerCase().includes(texto) || (p.nombre_cliente ?? '').toLowerCase().includes(texto))
    );
  });

  totalAbiertos = computed(() => this.proyectos().filter(p => p.estado === 'abierto').length);
  totalFinalizados = computed(() => this.proyectos().filter(p => p.estado === 'finalizado').length);

  ngOnInit(): void {
    this.form.get('texto')!.valueChanges.subscribe(v => this.textoFiltro.set((v ?? '').toLowerCase().trim()));
    this.form.get('estado')!.valueChanges.subscribe(v => this.estadoFiltro.set(v ?? ''));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.proyectoSrv.listarPublicos().subscribe(r => {
      this.proyectos.set(r.proyectos);
      this.cargando.set(false);
    });
  }

  async eliminar(p: Proyecto): Promise<void> {
    const ok = await this.dialogo.confirmar(
      `¿Eliminar definitivamente "${p.titulo}"? Solo es posible si no tiene propuestas ni contratos asociados.`,
      { titulo: 'Eliminar proyecto', textoConfirmar: 'Sí, eliminar' }
    );
    if (!ok) return;

    this.procesando.set(p.id_proyecto);
    this.proyectoSrv.eliminar(p.id_proyecto).subscribe({
      next: () => { this.cargar(); this.procesando.set(null); },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo eliminar el proyecto.', 'Error');
        this.procesando.set(null);
      }
    });
  }
}