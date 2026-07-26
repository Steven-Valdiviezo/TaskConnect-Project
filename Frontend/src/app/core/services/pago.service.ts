import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago } from '../../models/pago.model';
import { Contrato } from '../../models/contrato.model';
import { ContratoService } from './contrato.service';

export interface FilaPagoContrato {
  pago: Pago | null;
  contrato: Contrato;
}

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly baseUrl = `${environment.apiUrl}/pagos`;
  constructor(private http: HttpClient, private contratos: ContratoService) {}

  obtenerDeContrato(idContrato: number) {
    return this.http.get<{ pago: Pago }>(`${this.baseUrl}/contrato/${idContrato}`);
  }
  registrar(datos: { id_contrato: number; id_metodo_pago: number; monto: number }) {
    return this.http.post<{ pago: Pago }>(this.baseUrl, datos);
  }
  marcarPagado(id: number) {
    return this.http.patch<{ pago: Pago }>(`${this.baseUrl}/${id}/marcar-pagado`, {});
  }

  // Junta cada contrato del usuario con su pago (si existe)
  listarDeMisContratos() {
    return this.contratos.listarMios().pipe(
      switchMap(({ contratos }) => {
        if (!contratos.length) return of([] as FilaPagoContrato[]);
        const peticiones = contratos.map(c =>
          this.obtenerDeContrato(c.id_contrato).pipe(
            map(r => ({ pago: r.pago, contrato: c }) as FilaPagoContrato),
            catchError(() => of({ pago: null, contrato: c } as FilaPagoContrato))
          )
        );
        return forkJoin(peticiones);
      })
    );
  }
}