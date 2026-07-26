import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PagoService, FilaPagoContrato } from '../../../core/services/pago.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { MetodoPago } from '../../../models/catalogo.model';

@Component({
  selector: 'app-pagos-cliente',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './pagos-cliente.html',
  styleUrl: './pagos-cliente.css'
})
export class PagosCliente implements OnInit {
  private pagoSrv = inject(PagoService);
  private catalogo = inject(CatalogoService);

  filas = signal<FilaPagoContrato[]>([]);
  metodos = signal<MetodoPago[]>([]);
  cargando = signal(true);

  pagadas = computed(() => this.filas().filter(f => f.pago?.estado === 'pagado'));
  registrados = computed(() => this.filas().filter(f => !!f.pago));

  totalGastado = computed(() => this.pagadas().reduce((a, f) => a + Number(f.pago!.monto), 0));
  totalEsteMes = computed(() => {
    const ahora = new Date();
    return this.pagadas()
      .filter(f => f.pago!.fecha_pago && new Date(f.pago!.fecha_pago!).getMonth() === ahora.getMonth() && new Date(f.pago!.fecha_pago!).getFullYear() === ahora.getFullYear())
      .reduce((a, f) => a + Number(f.pago!.monto), 0);
  });
  pagosEsteMesCantidad = computed(() => {
    const ahora = new Date();
    return this.pagadas().filter(f => f.pago!.fecha_pago && new Date(f.pago!.fecha_pago!).getMonth() === ahora.getMonth() && new Date(f.pago!.fecha_pago!).getFullYear() === ahora.getFullYear()).length;
  });
  totalPendiente = computed(() => this.filas().filter(f => f.pago?.estado === 'pendiente').reduce((a, f) => a + Number(f.pago!.monto), 0));

  ngOnInit(): void {
    this.catalogo.listarMetodosPago().subscribe(r => this.metodos.set(r.metodos));
    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      this.filas.set(lista);
      this.cargando.set(false);
    });
  }

  nombreMetodo(id: number): string {
    return this.metodos().find(m => m.id_metodo_pago === id)?.nombre ?? '—';
  }
}