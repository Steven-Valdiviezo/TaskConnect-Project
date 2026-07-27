import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import { EstadisticasAdmin } from '../../models/estadisticas.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  listarUsuarios(filtros?: { rol?: string; estado?: string }) {
    let params = new HttpParams();
    if (filtros?.rol) params = params.set('rol', filtros.rol);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    return this.http.get<{ usuarios: Usuario[]; total: number }>(`${this.baseUrl}/usuarios`, { params });
  }
  desactivarUsuario(id: number) {
    return this.http.patch<{ usuario: Usuario }>(`${this.baseUrl}/usuarios/${id}/desactivar`, {});
  }
  reactivarUsuario(id: number) {
    return this.http.patch<{ usuario: Usuario }>(`${this.baseUrl}/usuarios/${id}/reactivar`, {});
  }
  obtenerEstadisticas() {
    return this.http.get<{ estadisticas: EstadisticasAdmin }>(`${this.baseUrl}/estadisticas`);
  }
}