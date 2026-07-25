import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth, Auth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, ActionCodeSettings
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

const CLAVE_CORREO_PENDIENTE = 'tc_correo_2fa';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private app: FirebaseApp;
  private auth: Auth;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async enviarEnlaceVerificacion(correo: string): Promise<void> {
    const settings: ActionCodeSettings = {
      url: `${window.location.origin}/login/verificar-correo`,
      handleCodeInApp: true
    };
    await sendSignInLinkToEmail(this.auth, correo, settings);
    localStorage.setItem(CLAVE_CORREO_PENDIENTE, correo);
  }

  esEnlaceDeVerificacion(url: string): boolean {
    return isSignInWithEmailLink(this.auth, url);
  }

  correoPendiente(): string | null {
    return localStorage.getItem(CLAVE_CORREO_PENDIENTE);
  }

  limpiarCorreoPendiente(): void {
    localStorage.removeItem(CLAVE_CORREO_PENDIENTE);
  }

  async confirmarEnlace(correo: string, url: string): Promise<string> {
    const credencial = await signInWithEmailLink(this.auth, correo, url);
    return await credencial.user.getIdToken();
  }
}