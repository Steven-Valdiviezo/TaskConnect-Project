import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { PropuestaService } from '../../../core/services/propuesta.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Proyecto } from '../../../models/proyecto.model';
import { sinSoloEspacios, maxDosDecimales, mensajeError } from '../../../core/validators/validadores';


@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './detalle-proyecto.html',
  styleUrl: './detalle-proyecto.css'
})
export class DetalleProyecto implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private proyectoSrv = inject(ProyectoService);
  private propuestaSrv = inject(PropuestaService);
  private dialogo = inject(DialogoService);

  proyecto = signal<Proyecto | null>(null);
  yaPropuesto = signal(false);
  cargando = signal(true);
  enviando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    mensaje: ['', [Validators.required, sinSoloEspacios, Validators.minLength(20), Validators.maxLength(1000)]],
    monto_propuesto: [null as number | null, [Validators.required, Validators.min(1), maxDosDecimales]]
  });

  msg = mensajeError;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.proyectoSrv.obtener(id).subscribe(r => {
      this.proyecto.set(r.proyecto);

      // --- Actualizacion: Asignar presupuesto máximo al validador del campo ---
      if (r.proyecto?.presupuesto) {
        this.form.get('monto_propuesto')?.addValidators(
          Validators.max(Number(r.proyecto.presupuesto))
        );
        this.form.get('monto_propuesto')?.updateValueAndValidity();
      }

      this.cargando.set(false);
    });

    this.propuestaSrv.listarEnviadas().subscribe(r => {
      this.yaPropuesto.set(r.propuestas.some(p => p.id_proyecto === id));
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const p = this.proyecto();
    if (!p) return;

    this.error.set(null);
    this.enviando.set(true);
    const v = this.form.getRawValue();

    this.propuestaSrv.enviar({ id_proyecto: p.id_proyecto, mensaje: v.mensaje!.trim(), monto_propuesto: v.monto_propuesto! }).subscribe({
      next: async () => {
        this.enviando.set(false);
        await this.dialogo.avisar('Tu propuesta fue enviada correctamente.', 'Propuesta enviada');
        this.router.navigateByUrl('/freelancer/mis-propuestas');
      },
      error: (err: any) => {
        this.enviando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo enviar la propuesta.');
      }
    });
  }
}