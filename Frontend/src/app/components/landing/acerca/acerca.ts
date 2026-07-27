import { Component, OnInit, inject, signal } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { EstadisticasPublicas } from '../../../models/estadisticas.model';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [Navbar],
  templateUrl: './acerca.html'
})
export class Acerca implements OnInit {
  private estadisticasService = inject(EstadisticasService);
  estadisticas = signal<EstadisticasPublicas | null>(null);

  ngOnInit(): void {
    this.estadisticasService.obtenerPublicas().subscribe({
      next: (respuesta) => this.estadisticas.set(respuesta.estadisticas),
      error: () => this.estadisticas.set(null)
    });
  }
}