import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ProyectoService } from '../../core/services/proyecto.service';
import { EstadisticasService } from '../../core/services/estadisticas.service';
import { Proyecto } from '../../models/proyecto.model';
import { EstadisticasPublicas } from '../../models/estadisticas.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Navbar, CurrencyPipe, DatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  private proyectoService = inject(ProyectoService);
  private estadisticasService = inject(EstadisticasService);

  cargandoEstadisticas = signal(true);
  estadisticas = signal<EstadisticasPublicas | null>(null);

  private proyectos = signal<Proyecto[]>([]);
  proyectosRecientes = computed(() =>
    this.proyectos().filter(p => p.estado === 'abierto').slice(0, 3)
  );

  ngOnInit(): void {
    this.estadisticasService.obtenerPublicas().subscribe({
      next: (respuesta) => this.estadisticas.set(respuesta.estadisticas),
      error: () => this.estadisticas.set(null),
      complete: () => this.cargandoEstadisticas.set(false)
    });

    this.proyectoService.listarPublicos().subscribe({
      next: (respuesta) => this.proyectos.set(respuesta.proyectos),
      error: () => this.proyectos.set([])
    });
  }
}