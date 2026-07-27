import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PerfilCliente, PerfilFreelancer, Usuario } from '../../models/usuario.model';

export interface PerfilRespuesta {
  usuario: Usuario;
  perfil: PerfilCliente | PerfilFreelancer | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {    
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;
  constructor(private http: HttpClient) {}

  obtenerPerfil() {
    return this.http.get<PerfilRespuesta>(`${this.baseUrl}/perfil`);
  }
  actualizarPerfil(datos: {
    nombre: string; telefono?: string; empresa?: string; direccion?: string;
    id_profesion?: number; experiencia?: number; descripcion?: string;
  }) {
    return this.http.put<PerfilRespuesta>(`${this.baseUrl}/perfil`, datos);
  }
}