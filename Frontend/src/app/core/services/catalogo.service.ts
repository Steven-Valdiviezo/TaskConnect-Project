import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Categoria, MetodoPago, Profesion } from '../../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listarCategorias() { return this.http.get<{ categorias: Categoria[] }>(`${this.baseUrl}/categorias`); }
  listarProfesiones() { return this.http.get<{ profesiones: Profesion[] }>(`${this.baseUrl}/profesiones`); }
  listarMetodosPago() { return this.http.get<{ metodos: MetodoPago[] }>(`${this.baseUrl}/metodos-pago`); }
}