import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { EstadisticasPublicas } from '../../../models/estadisticas.model';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './como-funciona.html'
})
export class ComoFunciona implements OnInit {
  private estadisticasService = inject(EstadisticasService);
  estadisticas = signal<EstadisticasPublicas | null>(null);

  ngOnInit(): void {
    this.estadisticasService.obtenerPublicas().subscribe({
      next: (respuesta) => this.estadisticas.set(respuesta.estadisticas),
      error: () => this.estadisticas.set(null)
    });
  }
}