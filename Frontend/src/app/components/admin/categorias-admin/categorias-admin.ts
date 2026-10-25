import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { AdminService } from '../../../core/services/admin.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Categoria } from '../../../models/catalogo.model';
import { sinSoloEspacios, mensajeError } from '../../../core/validators/validadores';

@Component({
  selector: 'app-categorias-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categorias-admin.html',
  styleUrl: './categorias-admin.css'
})
export class CategoriasAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private catalogo = inject(CatalogoService);
  private adminSrv = inject(AdminService);
  private dialogo = inject(DialogoService);

  categorias = signal<Categoria[]>([]);
  conteos = signal<Record<number, number>>({});
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  editando = signal<number | null>(null);

  form = this.fb.group({ 
    nombre_categoria: ['', [Validators.required, sinSoloEspacios, Validators.minLength(3), Validators.maxLength(100)]] 
  });

  // Para mostrar el mensaje de error en la plantilla
  msg = mensajeError;

  ngOnInit(): void {
    this.cargar();
    this.adminSrv.obtenerEstadisticas().subscribe(r => {
      const mapa: Record<number, number> = {};
      r.estadisticas.proyectos_por_categoria.forEach(c => mapa[c.id_categoria] = c.total);
      this.conteos.set(mapa);
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogo.listarCategorias().subscribe(r => { this.categorias.set(r.categorias); this.cargando.set(false); });
  }

  proyectosDe(id: number): number { return this.conteos()[id] ?? 0; }

  nuevo(): void { this.editando.set(null); this.form.reset(); this.error.set(null); }

  editar(c: Categoria): void {
    this.editando.set(c.id_categoria);
    this.form.patchValue({ nombre_categoria: c.nombre_categoria });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(null);
    this.guardando.set(true);
    const nombre = this.form.getRawValue().nombre_categoria!.trim();
    const id = this.editando();

    const peticion = id ? this.catalogo.actualizarCategoria(id, nombre) : this.catalogo.crearCategoria(nombre);
    peticion.subscribe({
      next: () => { this.guardando.set(false); this.cargar(); this.nuevo(); },
      error: (err: any) => { this.guardando.set(false); this.error.set(err?.error?.mensaje ?? 'No se pudo guardar la categoría.'); }
    });
  }

  async eliminar(c: Categoria): Promise<void> {
    const ok = await this.dialogo.confirmar(`¿Eliminar la categoría "${c.nombre_categoria}"?`, { titulo: 'Eliminar categoría', textoConfirmar: 'Sí, eliminar' });
    if (!ok) return;

    this.catalogo.eliminarCategoria(c.id_categoria).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo eliminar la categoría.', 'Error')
    });
  }
}