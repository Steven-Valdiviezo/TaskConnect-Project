import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './categorias.html'
})
export class Categorias {}