// src/app/components/admin/profesiones-admin/profesiones-admin.ts — REEMPLAZA
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { AdminService } from '../../../core/services/admin.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Profesion } from '../../../models/catalogo.model';
import { sinSoloEspacios, mensajeError } from '../../../core/validators/validadores';

@Component({
  selector: 'app-profesiones-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profesiones-admin.html',
  styleUrl: './profesiones-admin.css'
})
export class ProfesionesAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private catalogo = inject(CatalogoService);
  private adminSrv = inject(AdminService);
  private dialogo = inject(DialogoService);

  profesiones = signal<Profesion[]>([]);
  conteos = signal<Record<number, number>>({});
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  editando = signal<number | null>(null);

  form = this.fb.group({ 
    nombre: ['', [Validators.required, sinSoloEspacios, Validators.minLength(3), Validators.maxLength(30)]], 
    descripcion: ['', [Validators.required, sinSoloEspacios, Validators.minLength(10), Validators.maxLength(100)]] 
  });

  msg = mensajeError;

  ngOnInit(): void {
    this.cargar();
    this.adminSrv.obtenerEstadisticas().subscribe(r => {
      const mapa: Record<number, number> = {};
      r.estadisticas.freelancers_por_profesion.forEach(p => mapa[p.id_profesion] = p.total);
      this.conteos.set(mapa);
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogo.listarProfesiones().subscribe(r => { this.profesiones.set(r.profesiones); this.cargando.set(false); });
  }

  freelancersDe(id: number): number { return this.conteos()[id] ?? 0; }

  nuevo(): void { this.editando.set(null); this.form.reset(); this.error.set(null); }

  editar(p: Profesion): void {
    this.editando.set(p.id_profesion);
    this.form.patchValue({ nombre: p.nombre, descripcion: p.descripcion });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(null);
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const id = this.editando();

    const peticion = id ? this.catalogo.actualizarProfesion(id, { nombre: v.nombre!.trim(), descripcion: v.descripcion!.trim() })
                         : this.catalogo.crearProfesion({ nombre: v.nombre!.trim(), descripcion: v.descripcion!.trim() });
    peticion.subscribe({
      next: () => { this.guardando.set(false); this.cargar(); this.nuevo(); },
      error: (err: any) => { this.guardando.set(false); this.error.set(err?.error?.mensaje ?? 'No se pudo guardar la profesión.'); }
    });
  }

  async eliminar(p: Profesion): Promise<void> {
    const ok = await this.dialogo.confirmar(`¿Eliminar la profesión "${p.nombre}"?`, { titulo: 'Eliminar profesión', textoConfirmar: 'Sí, eliminar' });
    if (!ok) return;

    this.catalogo.eliminarProfesion(p.id_profesion).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo eliminar la profesión.', 'Error')
    });
  }
}