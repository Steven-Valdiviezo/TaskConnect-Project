import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './verificar-correo.html'
})
export class VerificarCorreo implements OnInit {
  private auth = inject(AuthService);
  private firebaseAuth = inject(FirebaseAuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  estado = signal<'validando' | 'pidiendo-correo' | 'error' | 'listo'>('validando');
  error = signal<string | null>(null);

  form = this.fb.group({
    correoManual: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const url = window.location.href;

    if (!this.firebaseAuth.esEnlaceDeVerificacion(url)) {
      this.estado.set('error');
      this.error.set('El enlace no es válido o ya expiró. Vuelve a iniciar sesión.');
      return;
    }

    const correo = this.firebaseAuth.correoPendiente();
    if (!correo) {
      this.estado.set('pidiendo-correo');
      return;
    }
    this.confirmar(correo);
  }

  confirmarConCorreoManual(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmar(this.form.getRawValue().correoManual!);
  }

  private confirmar(correo: string): void {
    const preAuthToken = localStorage.getItem('tc_pre_auth');
    if (!preAuthToken) {
      this.estado.set('error');
      this.error.set('Tu sesión de inicio expiró. Vuelve a iniciar sesión.');
      return;
    }

    this.firebaseAuth.confirmarEnlace(correo, window.location.href)
      .then(idToken => {
        this.auth.confirmarLogin2FA(preAuthToken, idToken).subscribe({
          next: () => {
            localStorage.removeItem('tc_pre_auth');
            this.firebaseAuth.limpiarCorreoPendiente();
            this.estado.set('listo');
            this.router.navigateByUrl(this.auth.rutaHomeSegunRol());
          },
          error: (err: any) => {
            this.estado.set('error');
            this.error.set(err?.error?.mensaje ?? 'No se pudo completar el inicio de sesión.');
          }
        });
      })
      .catch(() => {
        this.estado.set('error');
        this.error.set('El enlace no es válido o ya fue utilizado.');
      });
  }
}