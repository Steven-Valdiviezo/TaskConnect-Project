import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Contrato } from '../../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private readonly baseUrl = `${environment.apiUrl}/contratos`;
  constructor(private http: HttpClient) {}

  listarMios() {
    return this.http.get<{ contratos: Contrato[] }>(`${this.baseUrl}/mios`);
  }
  aceptarPropuesta(idPropuesta: number) {
    return this.http.post<{ contrato: Contrato }>(`${this.baseUrl}/aceptar/${idPropuesta}`, {});
  }
  completar(id: number) {
    return this.http.patch<{ contrato: Contrato }>(`${this.baseUrl}/${id}/completar`, {});
  }
  cancelar(id: number) {
    return this.http.patch<{ contrato: Contrato }>(`${this.baseUrl}/${id}/cancelar`, {});
  }
}