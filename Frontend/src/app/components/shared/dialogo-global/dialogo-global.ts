import { Component, inject } from '@angular/core';
import { DialogoService } from '../../../core/services/dialogo.service';

@Component({
  selector: 'app-dialogo-global',
  imports: [],
  templateUrl: './dialogo-global.html',
  styleUrl: './dialogo-global.css',
})
export class DialogoGlobal {
  dialogo = inject(DialogoService);
}