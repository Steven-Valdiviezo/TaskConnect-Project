import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginConfirmadoRespuesta, LoginPaso1Respuesta } from '../../models/auth.model';
import { RegistroPayload, SesionUsuario } from '../../models/usuario.model';

const CLAVE_TOKEN = 'tc_token';
const CLAVE_USUARIO = 'tc_usuario';
const CLAVE_CUENTAS = 'tc_cuentas';

export interface CuentaGuardada {
  token: string;
  usuario: SesionUsuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  private readonly _usuario = signal<SesionUsuario | null>(this.leerActiva()?.usuario ?? null);
  private readonly _token = signal<string | null>(this.leerActiva()?.token ?? null);
  private readonly _cuentas = signal<CuentaGuardada[]>(this.leerCuentas());

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly rol = computed(() => this._usuario()?.rol ?? null);
  readonly estaAutenticado = computed(() => this.tokenValido(this._token()));

  // Cuentas ya verificadas por 2FA cuyo token todavía no expira
  readonly cuentasGuardadas = computed(() => this._cuentas().filter(c => this.tokenValido(c.token)));

  // Solo true cuando el build NO es de producción; controla si el botón de login de prueba se muestra
  readonly loginPruebaDisponible = !environment.production;

  constructor(private http: HttpClient) {
    this.limpiarCuentasExpiradas();
  }

  private leerActiva(): CuentaGuardada | null {
    const token = localStorage.getItem(CLAVE_TOKEN);
    const raw = localStorage.getItem(CLAVE_USUARIO);
    if (!token || !raw) return null;
    return { token, usuario: JSON.parse(raw) };
  }

  private leerCuentas(): CuentaGuardada[] {
    const raw = localStorage.getItem(CLAVE_CUENTAS);
    return raw ? JSON.parse(raw) : [];
  }

  private guardarCuentas(cuentas: CuentaGuardada[]): void {
    localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
    this._cuentas.set(cuentas);
  }

  private limpiarCuentasExpiradas(): void {
    this.guardarCuentas(this.leerCuentas().filter(c => this.tokenValido(c.token)));
  }

  private decodificarToken(token: string): { exp?: number } | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private tokenValido(token: string | null): boolean {
    if (!token) return false;
    const payload = this.decodificarToken(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
  }

  loginPaso1(correo: string, contrasena: string): Observable<LoginPaso1Respuesta> {
    return this.http.post<LoginPaso1Respuesta>(`${this.baseUrl}/login`, { correo, contrasena });
  }

  confirmarLogin2FA(token: string): Observable<LoginConfirmadoRespuesta> {
    return this.http.post<LoginConfirmadoRespuesta>(`${this.baseUrl}/login/verificar-2fa`, { token })
      .pipe(tap(respuesta => this.guardarSesion(respuesta.token, respuesta.usuario)));
  }

  /** SOLO DESARROLLO: inicio de sesión directo, sin pasar por 2FA */
  loginPrueba(correo: string, contrasena: string): Observable<LoginConfirmadoRespuesta> {
    return this.http.post<LoginConfirmadoRespuesta>(`${this.baseUrl}/login-prueba`, { correo, contrasena })
      .pipe(tap(respuesta => this.guardarSesion(respuesta.token, respuesta.usuario)));
  }

  registrar(payload: RegistroPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/registro`, payload);
  }

  private guardarSesion(token: string, usuario: SesionUsuario): void {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);

    const otras = this.leerCuentas().filter(c => c.usuario.id_usuario !== usuario.id_usuario);
    this.guardarCuentas([...otras, { token, usuario }]);
  }

  /** Cambia a una cuenta ya verificada (sin pedir 2FA) mientras su token siga vigente */
  activarCuenta(idUsuario: number): boolean {
    const cuenta = this._cuentas().find(c => c.usuario.id_usuario === idUsuario);
    if (!cuenta || !this.tokenValido(cuenta.token)) return false;

    localStorage.setItem(CLAVE_TOKEN, cuenta.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(cuenta.usuario));
    this._token.set(cuenta.token);
    this._usuario.set(cuenta.usuario);
    return true;
  }

  /** Quita una cuenta guardada (no necesariamente la activa) de la lista de "cuentas abiertas" */
  olvidarCuenta(idUsuario: number): void {
    this.guardarCuentas(this._cuentas().filter(c => c.usuario.id_usuario !== idUsuario));
  }

  /** Cierra sesión SOLO de la cuenta activa; las demás cuentas guardadas no se tocan */
  cerrarSesion(): void {
    const activo = this._usuario();
    if (activo) this.olvidarCuenta(activo.id_usuario);

    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
  }

  rutaHomeSegunRol(): string {
    switch (this.rol()) {
      case 'cliente': return '/cliente/dashboard';
      case 'freelancer': return '/freelancer/dashboard';
      case 'administrador': return '/admin/dashboard';
      default: return '/login';
    }
  }
}