import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verificar-correo.html'
})
export class VerificarCorreo implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  estado = signal<'validando' | 'error' | 'listo'>('validando');
  error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.estado.set('error');
      this.error.set('El enlace no es válido. Vuelve a iniciar sesión.');
      return;
    }

    // quita el token de la barra de direcciones y del historial
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });

    this.auth.confirmarLogin2FA(token).subscribe({
      next: () => {
        this.estado.set('listo');
        this.router.navigateByUrl(this.auth.rutaHomeSegunRol());
      },
      error: (err: any) => {
        this.estado.set('error');
        this.error.set(err?.error?.mensaje ?? 'No se pudo completar el inicio de sesión.');
      }
    });
  }
}