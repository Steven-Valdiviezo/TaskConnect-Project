import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [Navbar],
  templateUrl: './acerca.html'
})
export class Acerca {}