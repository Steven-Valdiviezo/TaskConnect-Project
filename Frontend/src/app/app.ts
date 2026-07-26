import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogoGlobal } from './components/shared/dialogo-global/dialogo-global';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DialogoGlobal],
  templateUrl: './app.html'
})
export class App {}
