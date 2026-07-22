import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-cliente',
  imports: [],
  templateUrl: './perfil-cliente.html'
})
export class PerfilCliente {

  usuario = {
    iniciales: 'JC',
    nombre: 'Johan Cartuche',
    descripcion: 'Cliente • Registrado desde Mar 2025',
    empresaInfo: 'TechSolutions S.A. • Cuenca, Ecuador',

    nombreCompleto: 'Johan Paul Cartuche',
    correo: 'jpcartuche@techsol.com',
    telefono: '+593 98 765 4321',

    empresa: 'TechSolutions S.A.',
    direccion: 'Av. Solano 12-45, Cuenca',
    password: '********'
  };

}