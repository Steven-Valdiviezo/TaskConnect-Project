import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Mensaje } from '../../models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private readonly baseUrl = `${environment.apiUrl}/mensajes`;
  constructor(private http: HttpClient) {}

  conversacionCon(idUsuario: number) {
    return this.http.get<{ conversacion: Mensaje[] }>(`${this.baseUrl}/conversacion/${idUsuario}`);
  }
  enviar(destinatario: number, contenido: string) {
    return this.http.post<{ datos: Mensaje }>(this.baseUrl, { destinatario, contenido });
  }
  marcarLeido(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/leido`, {});
  }
}