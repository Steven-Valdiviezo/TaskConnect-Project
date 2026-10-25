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
import { calcularIva, totalCliente } from '../../../core/utils/montos';
import { maxDosDecimales, mensajeError } from '../../../core/validators/validadores';

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

  contratoEnPago = signal<Contrato | null>(null);
  tarifaIva = signal(0.15);
  totalPago = totalCliente;
  msg = mensajeError;
  pct = (t: number) => +(Number(t) * 100).toFixed(2);
  formPago = this.fb.group({
    id_metodo_pago: [null as number | null, Validators.required],
    adicional: [0, [Validators.min(0), maxDosDecimales]]
  });

  ngOnInit(): void {
    this.catalogo.listarMetodosPago().subscribe(r => this.metodos.set(r.metodos));
    this.catalogo.obtenerConfiguracion().subscribe(c => this.tarifaIva.set(c.tarifa_iva));
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
    if (c.estado_contraparte === 'inactivo') {
      await this.dialogo.avisar(
        `No es posible marcar el contrato como completado porque el freelancer "${c.nombre_contraparte}" se encuentra inactivo.`,
        'Freelancer inactivo'
      );
      return;
    }
  
    const ok = await this.dialogo.confirmar('¿Marcar este contrato como completado?', { titulo: 'Completar contrato', textoConfirmar: 'Sí, completar' });
    if (!ok) return;
  
    this.contratoSrv.completar(c.id_contrato).subscribe({
      next: () => this.cargar(),
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo completar el contrato.', 'Error')
    });
  }

  abrirFormPago(c: Contrato): void {
    this.formPago.reset({ id_metodo_pago: null, adicional: 0 });
    this.formPagoAbiertoPara.set(c.id_contrato);
    this.contratoEnPago.set(c);
  }
  
  cerrarFormPago(): void {
    this.formPagoAbiertoPara.set(null);
    this.contratoEnPago.set(null);
  }

  async registrarPago(c: Contrato): Promise<void> {
    if (this.formPago.get('adicional')!.invalid) {
      this.formPago.markAllAsTouched();
      return;
    }
    if (this.formPago.get('id_metodo_pago')!.invalid) {
      this.formPago.markAllAsTouched();
      return;
    }
  
    const base = c.monto_propuesto ?? 0;
    const adicional = Number(this.formPago.value.adicional) || 0;
    const montoFinal = base + adicional;
  
    if (adicional > 0 && c.presupuesto != null && montoFinal > c.presupuesto) {
      await this.dialogo.avisar(
        `El pago adicional hace que el total ($${montoFinal.toFixed(2)}) supere el presupuesto del proyecto ($${c.presupuesto}). Reduce el monto adicional.`,
        'Supera el presupuesto'
      );
      return;
    }
  
   const v = this.formPago.getRawValue();
    this.pagoSrv.registrar({ id_contrato: c.id_contrato, id_metodo_pago: v.id_metodo_pago!, monto: montoFinal }).subscribe({
      next: () => { this.formPagoAbiertoPara.set(null); this.contratoEnPago.set(null); this.cargar(); },
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
  get montoAPagar(): number {
    const base = this.contratoEnPago()?.monto_propuesto ?? 0;
    const adicional = Number(this.formPago.value.adicional) || 0;
    return base + adicional;
  }
  
  get margenDisponible(): number {
    const c = this.contratoEnPago();
    if (!c || c.presupuesto == null || c.monto_propuesto == null) return 0;
    return Math.max(0, c.presupuesto - c.monto_propuesto);
  }
  
  get comisionEstimadaMitad(): number {
    return Math.round(this.montoAPagar * 0.05 * 100) / 100;
  }
  
  get freelancerRecibiraEstimado(): number {
    return Math.round((this.montoAPagar - this.comisionEstimadaMitad) * 100) / 100;
  }
  get porcentajeIva(): number { return this.pct(this.tarifaIva()); }
  get ivaEstimado(): number {
    return calcularIva(this.montoAPagar, this.tarifaIva());
  }

// y totalClienteEstimado pasa a incluir el IVA:
  get totalClienteEstimado(): number {
    return Math.round((this.montoAPagar + this.ivaEstimado + this.comisionEstimadaMitad) * 100) / 100;
    
  }
}