import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {}
