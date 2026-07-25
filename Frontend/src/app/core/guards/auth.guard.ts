import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaAutenticado()) return true;
  router.navigate(['/login']);
  return false;
};

export const rolGuard = (rolesPermitidos: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaAutenticado() && rolesPermitidos.includes(auth.rol() ?? '')) return true;
  router.navigate(['/login']);
  return false;
};