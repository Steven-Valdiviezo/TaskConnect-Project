import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NuevoProyecto, Proyecto } from '../../models/proyecto.model';

export interface FiltrosProyectosPublicos {
  id_categoria?: number;
  presupuesto_min?: number;
  presupuesto_max?: number;
}

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private readonly baseUrl = `${environment.apiUrl}/proyectos`;
  constructor(private http: HttpClient) {}

  /** Endpoint público (GET /api/proyectos): no requiere sesión, útil para landing/búsqueda pública */
  listarPublicos(filtros?: FiltrosProyectosPublicos) {
    let params = new HttpParams();
    if (filtros?.id_categoria) params = params.set('id_categoria', filtros.id_categoria);
    if (filtros?.presupuesto_min) params = params.set('presupuesto_min', filtros.presupuesto_min);
    if (filtros?.presupuesto_max) params = params.set('presupuesto_max', filtros.presupuesto_max);
    return this.http.get<{ total: number; proyectos: Proyecto[] }>(this.baseUrl, { params });
  }

  listarMios() {
    return this.http.get<{ proyectos: Proyecto[] }>(`${this.baseUrl}/mios`);
  }
  obtener(id: number) {
    return this.http.get<{ proyecto: Proyecto }>(`${this.baseUrl}/${id}`);
  }
  crear(datos: NuevoProyecto) {
    return this.http.post<{ proyecto: Proyecto }>(this.baseUrl, datos);
  }
  actualizar(id: number, datos: Partial<NuevoProyecto>) {
    return this.http.put<{ proyecto: Proyecto }>(`${this.baseUrl}/${id}`, datos);
  }
  cancelar(id: number) {
    return this.http.patch<{ proyecto: Proyecto }>(`${this.baseUrl}/${id}/cancelar`, {});
  }
  eliminar(id: number) {
  return this.http.delete<{ proyecto: Proyecto }>(`${this.baseUrl}/${id}`);
  }
}