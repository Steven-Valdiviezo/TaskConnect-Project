import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Categoria } from '../../../models/catalogo.model';

@Component({
  selector: 'app-buscar-trabajo',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './buscar-trabajo.html',
  styleUrl: './buscar-trabajo.css'
})
export class BuscarTrabajo implements OnInit {
  private fb = inject(FormBuilder);
  private proyectoSrv = inject(ProyectoService);
  private propuestaSrv = inject(PropuestaService);
  private catalogo = inject(CatalogoService);

  categorias = signal<Categoria[]>([]);
  proyectos = signal<Proyecto[]>([]);
  idsPropuestos = signal<Set<number>>(new Set());
  cargando = signal(true);

  // Signals "puente" para que el filtrado reaccione a los cambios del form
  textoFiltro = signal('');
  categoriaFiltro = signal<number | null>(null);

  form = this.fb.group({
    texto: [''],
    id_categoria: [null as number | null]
  });

  proyectosFiltrados = computed(() => {
    const texto = this.textoFiltro();
    const idCategoria = this.categoriaFiltro();
    return this.proyectos().filter(p =>
      p.estado === 'abierto' &&
      (!texto || p.titulo.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)) &&
      (!idCategoria || p.id_categoria === idCategoria)
    );
  });

  ngOnInit(): void {
    this.form.get('texto')!.valueChanges.subscribe(v => this.textoFiltro.set((v ?? '').toLowerCase().trim()));
    this.form.get('id_categoria')!.valueChanges.subscribe(v => this.categoriaFiltro.set(v));

    this.catalogo.listarCategorias().subscribe(r => this.categorias.set(r.categorias));

    this.propuestaSrv.listarEnviadas().subscribe(r => {
      this.idsPropuestos.set(new Set(r.propuestas.map(p => p.id_proyecto)));
    });

    this.proyectoSrv.listarPublicos().subscribe(r => {
      this.proyectos.set(r.proyectos);
      this.cargando.set(false);
    });
  }

  yaPropuesto(idProyecto: number): boolean {
    return this.idsPropuestos().has(idProyecto);
  }
}