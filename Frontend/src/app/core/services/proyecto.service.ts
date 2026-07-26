import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NuevoProyecto, Proyecto } from '../../models/proyecto.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private readonly baseUrl = `${environment.apiUrl}/proyectos`;
  constructor(private http: HttpClient) {}

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
}