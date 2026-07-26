import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratoService } from '../../../core/services/contrato.service';
import { MensajeService } from '../../../core/services/mensaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contrato } from '../../../models/contrato.model';
import { Mensaje } from '../../../models/mensaje.model';

@Component({
  selector: 'app-mensajes-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mensajes-cliente.html',
  styleUrl: './mensajes-cliente.css'
})
export class MensajesCliente implements OnInit {
  private fb = inject(FormBuilder);
  private contratoSrv = inject(ContratoService);
  private mensajeSrv = inject(MensajeService);
  private auth = inject(AuthService);

  contratosActivos = signal<Contrato[]>([]);
  contratoSeleccionado = signal<Contrato | null>(null);
  mensajes = signal<Mensaje[]>([]);
  cargandoMensajes = signal(false);

  miIdUsuario = computed(() => this.auth.usuario()?.id_usuario ?? 0);

  formMensaje = this.fb.group({
    texto: ['', Validators.required]
  });

  ngOnInit(): void {
    this.contratoSrv.listarMios().subscribe(r => {
      const activos = r.contratos.filter(c => c.estado === 'activo');
      this.contratosActivos.set(activos);
      if (activos[0]) this.seleccionar(activos[0]);
    });
  }

  seleccionar(c: Contrato): void {
    this.contratoSeleccionado.set(c);
    this.cargandoMensajes.set(true);
    this.mensajeSrv.conversacionCon(c.id_usuario_contraparte!).subscribe(r => {
      this.mensajes.set(r.conversacion);
      this.cargandoMensajes.set(false);
    });
  }

  enviar(): void {
    const c = this.contratoSeleccionado();
    if (!c || this.formMensaje.invalid) return;
    const texto = this.formMensaje.getRawValue().texto!.trim();
    if (!texto) return;

    this.mensajeSrv.enviar(c.id_usuario_contraparte!, texto).subscribe({
      next: () => { this.formMensaje.reset(); this.seleccionar(c); },
      error: (err: any) => alert(err?.error?.mensaje ?? 'No se pudo enviar el mensaje.')
    });
  }

  iniciales(nombre?: string): string {
    return (nombre ?? '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}