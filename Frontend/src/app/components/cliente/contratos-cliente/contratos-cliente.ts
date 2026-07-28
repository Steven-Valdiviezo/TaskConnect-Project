import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratoService } from '../../../core/services/contrato.service';
import { PagoService, FilaPagoContrato } from '../../../core/services/pago.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Contrato } from '../../../models/contrato.model';
import { Pago } from '../../../models/pago.model';
import { MetodoPago } from '../../../models/catalogo.model';
import { DialogoService } from '../../../core/services/dialogo.service';
// Imports para mostar el perfil con contacto
import { DatePipe, DecimalPipe } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CalificacionService } from '../../../core/services/calificacion.service';
import { PerfilPublicoFreelancer } from '../../../models/usuario.model';

@Component({
  selector: 'app-contratos-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './contratos-cliente.html',
  styleUrl: './contratos-cliente.css'
})
export class ContratosCliente implements OnInit {
  private fb = inject(FormBuilder);
  private contratoSrv = inject(ContratoService);
  private pagoSrv = inject(PagoService);
  private catalogo = inject(CatalogoService);
  private dialogo = inject(DialogoService);

  private usuarioSrv = inject(UsuarioService);
  private calificacionSrv = inject(CalificacionService);

  filas = signal<FilaPagoContrato[]>([]);
  metodos = signal<MetodoPago[]>([]);
  cargando = signal(true);
  formPagoAbiertoPara = signal<number | null>(null);

  perfilAbierto = signal(false);
  cargandoPerfil = signal(false);
  perfilSeleccionado = signal<PerfilPublicoFreelancer | null>(null);
  ratingSeleccionado = signal(0);

  formPago = this.fb.group({
    id_metodo_pago: [null as number | null, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.catalogo.listarMetodosPago().subscribe(r => this.metodos.set(r.metodos));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      this.filas.set(lista);
      this.cargando.set(false);
    });
  }

  async completar(c: Contrato): Promise<void> {
    const ok = await this.dialogo.confirmar('¿Marcar este contrato como completado?', { titulo: 'Completar contrato', textoConfirmar: 'Sí, completar' });
    if (!ok) return;
  
    this.contratoSrv.completar(c.id_contrato).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo completar el contrato.', 'Error')
    });
  }

  abrirFormPago(c: Contrato): void {
    this.formPago.reset();
    this.formPagoAbiertoPara.set(c.id_contrato);
  }

  registrarPago(c: Contrato): void {
    if (this.formPago.invalid) {
      this.formPago.markAllAsTouched();
      return;
    }
    const v = this.formPago.getRawValue();
    this.pagoSrv.registrar({ id_contrato: c.id_contrato, id_metodo_pago: v.id_metodo_pago!, monto: v.monto! }).subscribe({
      next: () => { this.formPagoAbiertoPara.set(null); this.cargar(); },
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo registrar el pago.', 'Error')
    });
  }

  marcarPagado(p: Pago): void {
    this.pagoSrv.marcarPagado(p.id_pago).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo confirmar el pago.', 'Error')
    });
  }
  // Perfil de contrato
  verPerfilConContacto(idFreelancer: number): void {
    this.perfilAbierto.set(true);
    this.cargandoPerfil.set(true);
    this.perfilSeleccionado.set(null);
  
    this.usuarioSrv.obtenerPerfilConContacto(idFreelancer).subscribe({
      next: (r) => {
        this.perfilSeleccionado.set(r.perfil);
        this.cargandoPerfil.set(false);
      },
      error: async (err: any) => {
        this.cargandoPerfil.set(false);
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo cargar el perfil.', 'Error');
        this.perfilAbierto.set(false);
      }
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
  
  async cancelar(c: Contrato): Promise<void> {
    const ok = await this.dialogo.confirmar(
      '¿Cancelar este contrato? Úsalo si el freelancer no está cumpliendo con el trabajo. Esta acción no se puede deshacer.',
      { titulo: 'Cancelar contrato', textoConfirmar: 'Sí, cancelar', textoCancelar: 'Volver' }
    );
    if (!ok) return;
  
    this.contratoSrv.cancelar(c.id_contrato).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo cancelar el contrato.', 'Error')
    });
  }
  // Comportamiento de aceptar propuesta
  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'activo': return { bg: '#FAEEDA', color: '#633806' };
      case 'completado': return { bg: '#2a3a30', color: '#6e9e85' };
      default: return { bg: '#3a2a2a', color: '#e0a8a8' };
    }
  }
  // Comision agregada
  get comisionEstimada(): number {
  const monto = this.formPago.value.monto ?? 0;
  return Math.round(monto * 0.10 * 100) / 100;
  }
}