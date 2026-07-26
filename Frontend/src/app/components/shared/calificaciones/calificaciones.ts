import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratoService } from '../../../core/services/contrato.service';
import { CalificacionService } from '../../../core/services/calificacion.service';
import { Contrato } from '../../../models/contrato.model';
import { Calificacion } from '../../../models/calificacion.model';
import { DialogoService } from '../../../core/services/dialogo.service';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css'
})
export class Calificaciones implements OnInit {
  private fb = inject(FormBuilder);
  private contratoSrv = inject(ContratoService);
  private calificacionSrv = inject(CalificacionService);
  private dialogo = inject(DialogoService); 

  contratosCompletados = signal<Contrato[]>([]);
  emitidas = signal<Calificacion[]>([]);
  enviando = signal<number | null>(null);

  formsPorContrato: Record<number, FormGroup> = {};

  pendientes = computed(() => {
    const idsCalificados = new Set(this.emitidas().map(c => c.id_contrato));
    return this.contratosCompletados().filter(c => !idsCalificados.has(c.id_contrato));
  });

  yaCalificados = computed(() => {
    const mapa = new Map(this.contratosCompletados().map(c => [c.id_contrato, c]));
    return this.emitidas().map(cal => ({ calificacion: cal, contrato: mapa.get(cal.id_contrato) }));
  });

  ngOnInit(): void {
    this.contratoSrv.listarMios().subscribe(r => {
      const completados = r.contratos.filter(c => c.estado === 'completado');
      this.contratosCompletados.set(completados);
      completados.forEach(c => {
        this.formsPorContrato[c.id_contrato] = this.fb.group({
          puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          comentario: ['']
        });
      });
    });
    this.calificacionSrv.misEmitidas().subscribe(r => this.emitidas.set(r.calificaciones));
  }

  setPuntuacion(idContrato: number, valor: number): void {
    this.formsPorContrato[idContrato].patchValue({ puntuacion: valor });
  }

  async calificar(c: Contrato): Promise<void> {
  const form = this.formsPorContrato[c.id_contrato];
  if (form.invalid || !form.value.puntuacion) {
    await this.dialogo.avisar('Selecciona una puntuación entre 1 y 5.', 'Falta la puntuación');
    return;
  }

  this.enviando.set(c.id_contrato);
    this.calificacionSrv.registrar({
      id_contrato: c.id_contrato,
      puntuacion: form.value.puntuacion,
      comentario: form.value.comentario || undefined
    }).subscribe({
      next: (r) => {
        this.emitidas.update(lista => [...lista, r.calificacion]);
        this.enviando.set(null);
      },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo registrar la calificación.', 'Error');
        this.enviando.set(null);
      }
    });
  }
}