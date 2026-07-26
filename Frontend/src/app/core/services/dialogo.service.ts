import { Injectable, signal } from '@angular/core';

interface EstadoDialogo {
  visible: boolean;
  tipo: 'confirmar' | 'aviso';
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  textoCancelar: string;
  resolver?: (valor: boolean) => void;
}

const ESTADO_INICIAL: EstadoDialogo = {
  visible: false, tipo: 'aviso', titulo: '', mensaje: '', textoConfirmar: 'Aceptar', textoCancelar: 'Cancelar'
};

@Injectable({ providedIn: 'root' })
export class DialogoService {
  private readonly _estado = signal<EstadoDialogo>(ESTADO_INICIAL);
  readonly estado = this._estado.asReadonly();

  confirmar(mensaje: string, opciones?: { titulo?: string; textoConfirmar?: string; textoCancelar?: string }): Promise<boolean> {
    return new Promise(resolve => {
      this._estado.set({
        visible: true, tipo: 'confirmar',
        titulo: opciones?.titulo ?? 'Confirmar acción',
        mensaje,
        textoConfirmar: opciones?.textoConfirmar ?? 'Aceptar',
        textoCancelar: opciones?.textoCancelar ?? 'Cancelar',
        resolver: resolve
      });
    });
  }

  avisar(mensaje: string, titulo = 'Aviso'): Promise<void> {
    return new Promise(resolve => {
      this._estado.set({
        visible: true, tipo: 'aviso', titulo, mensaje,
        textoConfirmar: 'Entendido', textoCancelar: '',
        resolver: () => resolve()
      });
    });
  }

  responder(valor: boolean): void {
    this._estado().resolver?.(valor);
    this._estado.set(ESTADO_INICIAL);
  }
}