import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { MetodoPago } from '../../../models/catalogo.model';

@Component({
  selector: 'app-metodos-pago-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './metodos-pago-admin.html',
  styleUrl: './metodos-pago-admin.css'
})
export class MetodosPagoAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private catalogo = inject(CatalogoService);
  private dialogo = inject(DialogoService);

  metodos = signal<MetodoPago[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  editando = signal<number | null>(null);

  form = this.fb.group({ nombre: ['', Validators.required], descripcion: ['', Validators.required] });

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.catalogo.listarMetodosPago().subscribe(r => { this.metodos.set(r.metodos); this.cargando.set(false); });
  }

  nuevo(): void { this.editando.set(null); this.form.reset(); this.error.set(null); }

  editar(m: MetodoPago): void {
    this.editando.set(m.id_metodo_pago);
    this.form.patchValue({ nombre: m.nombre, descripcion: m.descripcion });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(null);
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const id = this.editando();

    const peticion = id ? this.catalogo.actualizarMetodoPago(id, { nombre: v.nombre!, descripcion: v.descripcion! })
                         : this.catalogo.crearMetodoPago({ nombre: v.nombre!, descripcion: v.descripcion! });
    peticion.subscribe({
      next: () => { this.guardando.set(false); this.cargar(); this.nuevo(); },
      error: (err: any) => { this.guardando.set(false); this.error.set(err?.error?.mensaje ?? 'No se pudo guardar el método de pago.'); }
    });
  }

  async eliminar(m: MetodoPago): Promise<void> {
    const ok = await this.dialogo.confirmar(`¿Eliminar el método de pago "${m.nombre}"?`, { titulo: 'Eliminar método de pago', textoConfirmar: 'Sí, eliminar' });
    if (!ok) return;

    this.catalogo.eliminarMetodoPago(m.id_metodo_pago).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo eliminar el método de pago.', 'Error')
    });
  }
}