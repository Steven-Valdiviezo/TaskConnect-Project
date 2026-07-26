import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private firebaseAuth = inject(FirebaseAuthService);
  private router = inject(Router);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  cargando = signal(false);
  error = signal<string | null>(null);
  correoEnviado = signal(false);
  mostrarFormulario = signal(false);

  cuentasGuardadas = this.auth.cuentasGuardadas;

  ngOnInit(): void {
    // Ya NO redirigimos automáticamente aquí.
    // Si el usuario llega a /login, siempre debe poder ver
    // el selector de cuentas guardadas (o el formulario si no tiene ninguna).
    // El único lugar donde se navega hacia el dashboard es cuando
    // el usuario elige explícitamente una cuenta (usarCuenta) o
    // termina el flujo de login/2FA.
  }

  usarCuenta(idUsuario: number): void {
    if (this.auth.activarCuenta(idUsuario)) {
      this.router.navigateByUrl(this.auth.rutaHomeSegunRol());
    }
  }

  quitarCuenta(idUsuario: number, evento: Event): void {
    evento.stopPropagation();
    this.auth.olvidarCuenta(idUsuario);
  }

  inicialesDe(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.cargando.set(true);
    const { correo, contrasena } = this.form.getRawValue();

    this.auth.loginPaso1(correo!, contrasena!).subscribe({
      next: async (respuesta) => {
        localStorage.setItem('tc_pre_auth', respuesta.preAuthToken);
        try {
          await this.firebaseAuth.enviarEnlaceVerificacion(respuesta.correo);
          this.correoEnviado.set(true);
        } catch {
          this.error.set('No se pudo enviar el correo de verificación. Intenta de nuevo.');
        } finally {
          this.cargando.set(false);
        }
      },
      error: (err: any) => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Correo o contraseña incorrectos');
      }
    });
  }
}