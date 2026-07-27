import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratoService } from '../../../core/services/contrato.service';
import { MensajeService } from '../../../core/services/mensaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contrato } from '../../../models/contrato.model';
import { Mensaje } from '../../../models/mensaje.model';
import { DialogoService } from '../../../core/services/dialogo.service';

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
  private dialogo = inject(DialogoService);

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
      this.marcarComoLeidos(r.conversacion);
    });
  }

  enviar(): void {
    const c = this.contratoSeleccionado();
    if (!c || this.formMensaje.invalid) return;
    const texto = this.formMensaje.getRawValue().texto!.trim();
    if (!texto) return;
  
    this.mensajeSrv.enviar(c.id_usuario_contraparte!, texto).subscribe({
      next: () => { this.formMensaje.reset(); this.seleccionar(c); },
      error: async (err: any) => this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo enviar el mensaje.', 'Error')
    });
  }

  iniciales(nombre?: string): string {
    return (nombre ?? '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  //Metodos para leer mensajes y hora
  private marcarComoLeidos(conversacion: Mensaje[]): void {
    conversacion
      .filter(m => m.destinatario === this.miIdUsuario() && !m.leido)
      .forEach(m => {
        this.mensajeSrv.marcarLeido(m.id_mensaje).subscribe(() => {
          this.mensajes.update(lista => lista.map(x => x.id_mensaje === m.id_mensaje ? { ...x, leido: true } : x));
        });
      });
  }
  
  horaDe(fechaIso: string): string {
    return new Date(fechaIso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  }
}