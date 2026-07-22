import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil-freelancer',
  imports: [RouterLink],
  templateUrl: './perfil-freelancer.html',
  styleUrl: './perfil-freelancer.css',
})
export class PerfilFreelancer {

  usuario = {
    iniciales: 'EM',
    nombre: 'Ernesto Maldonado',
    descripcion: 'Diseñador UX/UI • 4 años de experiencia',

    rating: 4.8,
    contratos: 12,
    ingresos: 4200,

    nombreCompleto: 'Ernesto Maldonado',
    correo: 'ernesto@uxpro.com',
    telefono: '+593 99 123 4567',

    profesion: 'Diseñador UX/UI',
    experiencia: 4,
    descripcionPerfil: 'Diseñador con enfoque en productos digitales.'
  };

}
