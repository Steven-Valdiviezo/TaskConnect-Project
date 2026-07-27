import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Categoria } from '../../../models/catalogo.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './categorias.html'
})
export class Categorias implements OnInit {
  private catalogoService = inject(CatalogoService);
  categorias = signal<Categoria[]>([]);

  ngOnInit(): void {
    this.catalogoService.listarCategorias().subscribe({
      next: (respuesta) => this.categorias.set(respuesta.categorias),
      error: () => this.categorias.set([])
    });
  }
}