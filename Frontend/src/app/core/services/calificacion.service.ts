import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Calificacion } from '../../models/calificacion.model';

@Injectable({ providedIn: 'root' })
export class CalificacionService {
  private readonly baseUrl = `${environment.apiUrl}/calificaciones`;
  constructor(private http: HttpClient) {}

  registrar(datos: { id_contrato: number; puntuacion: number; comentario?: string }) {
    return this.http.post<{ calificacion: Calificacion }>(this.baseUrl, datos);
  }
  recibidasPor(idUsuario: number) {
    return this.http.get<{ calificaciones: Calificacion[] }>(`${this.baseUrl}/usuario/${idUsuario}`);
  }
  misEmitidas() {
    return this.http.get<{ calificaciones: Calificacion[] }>(`${this.baseUrl}/mias/emitidas`);
  }
  reputacionDe(idFreelancer: number) {
    return this.http.get<{ reputacion: number }>(`${this.baseUrl}/reputacion/${idFreelancer}`);
  }
}