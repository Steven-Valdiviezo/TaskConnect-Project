import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstadisticasPublicas } from '../../models/estadisticas.model';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly baseUrl = `${environment.apiUrl}/estadisticas`;
  constructor(private http: HttpClient) {}

  obtenerPublicas() {
    return this.http.get<{ estadisticas: EstadisticasPublicas }>(this.baseUrl);
  }
}