// src/app/components/freelancer/contratos-freelancer/contratos-freelancer.ts — REEMPLAZA
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PagoService, FilaPagoContrato } from '../../../core/services/pago.service';

@Component({
  selector: 'app-contratos-freelancer',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './contratos-freelancer.html',
  styleUrl: './contratos-freelancer.css'
})
export class ContratosFreelancer implements OnInit {
  private pagoSrv = inject(PagoService);

  filas = signal<FilaPagoContrato[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      this.filas.set(lista);
      this.cargando.set(false);
    });
  }

  claseBadge(estado: string): { bg: string; color: string } {
    switch (estado) {
      case 'activo': return { bg: '#FAEEDA', color: '#633806' };
      case 'completado': return { bg: '#2a3040', color: '#6e8fa8' };
      default: return { bg: '#3a2a2a', color: '#e0a8a8' };
    }
  }
}