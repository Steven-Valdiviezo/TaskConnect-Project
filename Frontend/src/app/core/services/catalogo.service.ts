import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Categoria, MetodoPago, Profesion } from '../../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ---- Categoría ----
  listarCategorias() { return this.http.get<{ categorias: Categoria[] }>(`${this.baseUrl}/categorias`); }
  crearCategoria(nombre_categoria: string) { return this.http.post<{ categoria: Categoria }>(`${this.baseUrl}/categorias`, { nombre_categoria }); }
  actualizarCategoria(id: number, nombre_categoria: string) { return this.http.put<{ categoria: Categoria }>(`${this.baseUrl}/categorias/${id}`, { nombre_categoria }); }
  eliminarCategoria(id: number) { return this.http.delete(`${this.baseUrl}/categorias/${id}`); }

  // ---- Profesión ----
  listarProfesiones() { return this.http.get<{ profesiones: Profesion[] }>(`${this.baseUrl}/profesiones`); }
  crearProfesion(datos: { nombre: string; descripcion: string }) { return this.http.post<{ profesion: Profesion }>(`${this.baseUrl}/profesiones`, datos); }
  actualizarProfesion(id: number, datos: { nombre: string; descripcion: string }) { return this.http.put<{ profesion: Profesion }>(`${this.baseUrl}/profesiones/${id}`, datos); }
  eliminarProfesion(id: number) { return this.http.delete(`${this.baseUrl}/profesiones/${id}`); }

  // ---- Método de pago ----
  listarMetodosPago() { return this.http.get<{ metodos: MetodoPago[] }>(`${this.baseUrl}/metodos-pago`); }
  crearMetodoPago(datos: { nombre: string; descripcion: string }) { return this.http.post<{ metodo: MetodoPago }>(`${this.baseUrl}/metodos-pago`, datos); }
  actualizarMetodoPago(id: number, datos: { nombre: string; descripcion: string }) { return this.http.put<{ metodo: MetodoPago }>(`${this.baseUrl}/metodos-pago/${id}`, datos); }
  eliminarMetodoPago(id: number) { return this.http.delete(`${this.baseUrl}/metodos-pago/${id}`); }
  
  // ---- Configuración pública (tarifa de IVA vigente) ----
  obtenerConfiguracion() { return this.http.get<{ tarifa_iva: number }>(`${this.baseUrl}/configuracion`); }
}