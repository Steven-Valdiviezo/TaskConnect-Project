import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './como-funciona.html'
})
export class ComoFunciona {}