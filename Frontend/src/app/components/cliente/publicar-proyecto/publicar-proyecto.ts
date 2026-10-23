import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Categoria } from '../../../models/catalogo.model';
import { sinSoloEspacios, maxDosDecimales, fechaNoPasada, mensajeError } from '../../../core/validators/validadores';


@Component({
  selector: 'app-publicar-proyecto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './publicar-proyecto.html',
  styleUrl: './publicar-proyecto.css'
})
export class PublicarProyecto implements OnInit {
  private fb = inject(FormBuilder);
  private proyectoSrv = inject(ProyectoService);
  private catalogo = inject(CatalogoService);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    titulo: ['', [Validators.required, sinSoloEspacios, Validators.minLength(5), Validators.maxLength(150)]],
    id_categoria: [null as number | null, Validators.required],
    presupuesto: [null as number | null, [Validators.required, Validators.min(1), Validators.max(1000000), maxDosDecimales]],
    descripcion: ['', [Validators.required, sinSoloEspacios, Validators.minLength(20), Validators.maxLength(2000)]],
    fecha_entrega: ['', [fechaNoPasada]]
  });

   msg = mensajeError;

    hoy = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  ngOnInit(): void {
    this.catalogo.listarCategorias().subscribe(r => this.categorias.set(r.categorias));
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.cargando.set(true);
    const v = this.form.getRawValue();

    this.proyectoSrv.crear({
      titulo: v.titulo!.trim(), descripcion: v.descripcion!.trim(), presupuesto: v.presupuesto!,
      id_categoria: v.id_categoria!, fecha_entrega: v.fecha_entrega || undefined
    }).subscribe({
      next: () => this.router.navigateByUrl('/cliente/mis-proyectos'),
      error: (err: any) => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo publicar el proyecto.');
      }
    });
  }
}