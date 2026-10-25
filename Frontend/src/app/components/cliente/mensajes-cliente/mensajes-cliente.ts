import { Component, OnInit, computed, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratoService } from '../../../core/services/contrato.service';
import { MensajeService } from '../../../core/services/mensaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contrato } from '../../../models/contrato.model';
import { Mensaje } from '../../../models/mensaje.model';
import { DialogoService } from '../../../core/services/dialogo.service';
import { sinSoloEspacios } from '../../../core/validators/validadores';

/** Una fila de "Conversaciones" = una persona, sin importar cuántos contratos/proyectos
 *  tengas en común con ella (antes se repetía una fila por cada contrato). */
interface ConversacionAgrupada {
  idUsuarioContraparte: number;
  nombreContraparte?: string;
  proyectos: string[];
  contrato: Contrato; // contrato representativo, solo para reusar sus datos si hace falta
}

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

  @ViewChild('contenedorMensajes') contenedorMensajes?: ElementRef<HTMLDivElement>;

  contratosActivos = signal<Contrato[]>([]);
  idContraparteSeleccionado = signal<number | null>(null);
  mensajes = signal<Mensaje[]>([]);
  cargandoMensajes = signal(false);
  verChat = signal(false);   // en celular: false = lista de conversaciones, true = chat abierto
  miIdUsuario = computed(() => this.auth.usuario()?.id_usuario ?? 0);

  constructor() {
    // Cada vez que cambia la lista de mensajes (nueva conversación seleccionada,
    // mensaje enviado o recibido), se baja el scroll al final.
    effect(() => {
      this.mensajes();
      requestAnimationFrame(() => {
        const el = this.contenedorMensajes?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
  }
  /** Agrupa los contratos activos por persona, para no duplicar la misma
   *  conversación una vez por cada proyecto que compartas con ese freelancer. */
  conversaciones = computed<ConversacionAgrupada[]>(() => {
    const mapa = new Map<number, ConversacionAgrupada>();

    for (const c of this.contratosActivos()) {
      if (!c.id_usuario_contraparte) continue;

      const existente = mapa.get(c.id_usuario_contraparte);
      if (existente) {
        if (c.titulo_proyecto) existente.proyectos.push(c.titulo_proyecto);
      } else {
        mapa.set(c.id_usuario_contraparte, {
          idUsuarioContraparte: c.id_usuario_contraparte,
          nombreContraparte: c.nombre_contraparte,
          proyectos: c.titulo_proyecto ? [c.titulo_proyecto] : [],
          contrato: c
        });
      }
    }

    return Array.from(mapa.values());
  });

  conversacionSeleccionada = computed(() =>
    this.conversaciones().find(c => c.idUsuarioContraparte === this.idContraparteSeleccionado()) ?? null
  );

  formMensaje = this.fb.group({
    texto: ['', [Validators.required, sinSoloEspacios, Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    this.contratoSrv.listarMios().subscribe(r => {
      const activos = r.contratos.filter(c => c.estado === 'activo');
      this.contratosActivos.set(activos);
      const primera = this.conversaciones()[0];
      if (primera) this.seleccionar(primera);
    });
  }

  seleccionar(conv: ConversacionAgrupada): void {
    this.idContraparteSeleccionado.set(conv.idUsuarioContraparte);
    this.cargandoMensajes.set(true);
    this.mensajeSrv.conversacionCon(conv.idUsuarioContraparte).subscribe(r => {
      this.mensajes.set(r.conversacion);
      this.cargandoMensajes.set(false);
      this.marcarComoLeidos(r.conversacion);
    });
  }

  enviar(): void {
    const conv = this.conversacionSeleccionada();
    if (!conv || this.formMensaje.invalid) return;
    const texto = this.formMensaje.getRawValue().texto!.trim();
    if (!texto) return;

    this.mensajeSrv.enviar(conv.idUsuarioContraparte, texto).subscribe({
      next: () => { this.formMensaje.reset(); this.seleccionar(conv); },
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