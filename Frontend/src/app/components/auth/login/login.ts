import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
//import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

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
  // private firebaseAuth = inject(FirebaseAuthService);
  private router = inject(Router);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  cargando = signal(false);
  error = signal<string | null>(null);
  correoEnviado = signal(false);
  mostrarFormulario = signal(false);
  loginPruebaCargando = signal(false);
  verContrasena = signal(false);

  cuentasGuardadas = this.auth.cuentasGuardadas;
  loginPruebaDisponible = this.auth.loginPruebaDisponible;

  ngOnInit(): void {
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
      next: () => {
        // el backend ya envió el magic link por Brevo
        this.cargando.set(false);
        this.correoEnviado.set(true);
      },
      error: (err: any) => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo iniciar sesión. Intenta de nuevo.');
      }
    });
  }

  /** ⚠️ SOLO DESARROLLO: entra directo con correo/contrasena, sin Firebase 2FA */
  entrarConUsuarioPrueba(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.loginPruebaCargando.set(true);
    const { correo, contrasena } = this.form.getRawValue();

    this.auth.loginPrueba(correo!, contrasena!).subscribe({
      next: () => {
        this.loginPruebaCargando.set(false);
        this.router.navigateByUrl(this.auth.rutaHomeSegunRol());
      },
      error: (err: any) => {
        this.loginPruebaCargando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo iniciar la sesión de prueba');
      }
    });
  }
}