import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, RolUsuario } from './auth-store';

const rolesValidos: RolUsuario[] = ['MEDICO', 'PACIENTE', 'ADMINISTRADOR'];

export const roleGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const token = authStore.obtenerToken();
  const rol = authStore.obtenerRol();
  const rolesPermitidos = route.data['roles'];

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  if (!rol || !Array.isArray(rolesPermitidos) || rolesPermitidos.length === 0) {
    return router.createUrlTree(['/inicio/home']);
  }

  const rolesConfigurados = rolesPermitidos.filter(
    (role: unknown): role is RolUsuario =>
      rolesValidos.some((rolValido) => rolValido === role),
  );

  if (rolesConfigurados.length !== rolesPermitidos.length) {
    return router.createUrlTree(['/inicio/home']);
  }

  return rolesConfigurados.includes(rol)
    ? true
    : router.createUrlTree(['/inicio/home']);
};
