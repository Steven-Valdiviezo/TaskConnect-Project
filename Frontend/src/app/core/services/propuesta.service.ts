import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Propuesta } from '../../models/propuesta.model';

@Injectable({ providedIn: 'root' })
export class PropuestaService {
  private readonly baseUrl = `${environment.apiUrl}/propuestas`;
  constructor(private http: HttpClient) {}

  listarDeProyecto(idProyecto: number) {
    return this.http.get<{ propuestas: Propuesta[] }>(`${this.baseUrl}/proyecto/${idProyecto}`);
  }
  listarRecibidas() {
    return this.http.get<{ propuestas: Propuesta[] }>(`${this.baseUrl}/mias/recibidas`);
  }
  listarEnviadas() {
  return this.http.get<{ propuestas: Propuesta[] }>(`${this.baseUrl}/mias/enviadas`);
  }
  enviar(datos: { id_proyecto: number; mensaje: string; monto_propuesto: number }) {
    return this.http.post<{ propuesta: Propuesta }>(this.baseUrl, datos);
  }
  retirar(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  // Rechazo de propuesta enviada por el freelancer
  rechazar(id: number) {
  return this.http.patch<{ propuesta: Propuesta }>(`${this.baseUrl}/${id}/rechazar`, {});
  }
}